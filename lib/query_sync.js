/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the QuerySync class, used to create a binding between
 * a query model on $scope and a GoInstant query
 */

'use strict';

var _ = require('lodash');

module.exports = function querySync($parse, $timeout) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function(query, qModel) {
    return new QuerySync($parse, $timeout, query, qModel);
  };
};

/**
 * The Sync class is responsible for synchronizing the state of a local model,
 * with that of a GoInstant key.
 *
 * @constructor
 * @param {Object} $parse - Angular parse object
 * @param {Object} $timeout - Angular timeout object
 * @param {Object} query - GoInstant query object
 * @param {Object} model - local object
 */
function QuerySync($parse, $timeout, query, model) {
  _.bindAll(this, [
    '$initialize',
    '$$handleUpdate',
    '$$handleRemove'
  ]);

  _.extend(this, {
    $parse: $parse,
    $timeout: $timeout,
    $$query: query,
    $$model: model,
    $$registry: {}
  });
}

/**
 * Creates an association between a local object and a query by
 * fetching a result set and monitoring the query.
 */
QuerySync.prototype.$initialize = function() {
  var self = this;
  var index = self.$$model.$$index;

  self.$$query.execute(function(err, results) {
    if (err) {
      return self.$$model.$$emitter.emit('error', err);
    }

    self.$$registry = {
      update: self.$$handleUpdate,
      add: self.$$handleUpdate,
      remove: self.$$handleRemove
    };

    _.each(self.$$registry, function(fn, event) {
      self.$$query.on(event, fn);
    });

    self.$timeout(function() {
      _.map(results, function(result) {
        index.push(result.name);
        self.$$model[result.name] = result.value;
      });

      self.$$model.$$emitter.emit('ready');
    });
  });
};

/**
 * When the query result set changes, update our local model object
 * @private
 * @param {*} result - new result set
 * @param {Object} context - Information related to the key being set
 */
QuerySync.prototype.$$handleUpdate = function(result, context) {
  var self = this;

  var index = self.$$model.$$index;

  // Update the index array with the new position of this key
  var currentIndex = index.indexOf(result.name);

  if (currentIndex !== -1) {
    index.splice(currentIndex, 1);
  }

  index.splice(context.position.current, 0, result.name);

  // Update the value of the model.
  // The index update above will NOT trigger any changes on scope.
  // Removing this will cause position to not be updated.
  self.$timeout(function() {
    self.$$model[result.name] = result.value;
  });
};

/**
 * When an item is removed from the result set, update the model
 * @private
 * @param {*} result - new result set
 * @param {Object} context - information related to the key being set
 */
QuerySync.prototype.$$handleRemove = function(result, context) {
  this.$$model.$$index.splice(context.position.previous, 1);

  var self = this;
  this.$timeout(function() {
    delete self.$$model[result.name];
  });
};
