/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the KeySync class, used to create a binding between
 * a model on $scope and a GoInstant key
 */

'use strict';

/* @todo slowly phase out external dependencies */
var _ = require('lodash');
var normalize = require('./util/normalize');

module.exports = function keySync($parse, $timeout) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function(key) {
    return new KeySync($parse, $timeout, key);
  };
};

/**
 * The KeySync class is responsible for synchronizing the state of a local model
 * with that of a GoInstant key.
 *
 * @constructor
 * @param {Object} $parse - Angular parse object
 * @param {Object} $timeout - Angular timeout object
 * @param {Object} key - Key unique to the controller scope
 */
function KeySync($parse, $timeout, key) {
  _.bindAll(this, [
    '$initialize',
    '$$handleUpdate',
    '$$handleRemove'
  ]);

  _.extend(this, {
    $parse: $parse,
    $timeout: $timeout,
    $$key: key,
    $$model: null,
    $$registry: {}
  });
}

/**
 * Creates an association between a local object and a key in goinstant by
 * fetching an existing value and monitoring the key.
 * @param {Object} model - local object
 */
KeySync.prototype.$initialize = function(model) {
  this.$$model = model;
  var self = this;

  self.$$key.get(function(err, value) {
    if (err) {
      return self.$$model.$$emitter.emit('error', err);
    }

    self.$$registry = {
      set: self.$$handleUpdate,
      add: self.$$handleUpdate,
      remove: self.$$handleRemove
    };

    _.each(self.$$registry, function(fn, event) {
      self.$$key.on(event, {
        local: true,
        bubble: true,
        listener: fn
      });
    });

    if (!_.isObject(value)) {
      value = { $value: value };
    }

    self.$timeout(function() {
      _.merge(self.$$model, value);
      self.$$model.$$emitter.emit('ready');
    });
  });
};

/**
 * When the value of the key has changed, we update our local model object
 * @private
 * @param {*} value - New key value
 * @param {Object} context - Information related to the key being set
 */
KeySync.prototype.$$handleUpdate = function(value, context) {
  var self = this;
  var targetKey = (context.command ==='ADD') ? context.addedKey : context.key;

  if (!_.isObject(value) && targetKey === context.currentKey) {
    return self.$timeout(function() {
      self.$$model.$value = value;

      _.each(self.$$model, function(value, key, model) {
        if (_.first(key) !== '$') {
          delete model[key];
        }
      });
    });
  }

  value = normalize(_.cloneDeep(value), context);

  self.$timeout(function() {
    _.merge(self.$$model, value);
    delete self.$$model.$value;
  });
};

/**
 * When a key or one of it's children is destroyed we persist locally
 * @private
 * @param {*} value - New key value
 * @param {Object} context - Information related to the key being set
 */
KeySync.prototype.$$handleRemove = function(value, context) {
  var self = this;

  if (context.currentKey === context.key) {

    self.$timeout(function() {
      if (self.$$model.$value) {
        delete self.$$model.$value;
        return;
      }

      _.each(self.$$model, function(value, key, model) {
        if (_.first(key) !== '$') {
          delete model[key];
        }
      });
    });

    _.each(self.$$registry, function (fn, event) {
      self.$$key.off(event, fn);
    });

    return;
  }

  // Determine the relative path between the key we are listening too and the
  // origin of the event.
  var toPath = context.key.replace(context.currentKey, ''); // resolve path
  toPath = toPath.replace(/^\/|\/$/g, ''); // trim trailing and starting slash

  var sections = toPath.split('/');
  var target = this.$$model;

  // Loop over all the keys we need to navigate and traverse down until
  // we're at the parent of the section being removed.
  var ptr = [target]; // references to parts of the cache object
  var parentIndex = sections.length - 1;

  for (var i = 0; i < parentIndex; i++) {
    target = target[sections[i]];

    if (target === undefined) {
      return this._resync();
    }

    ptr.push(target);
  }

  self.$timeout(function() {
    delete target[sections[parentIndex]];
  });

  // Now that we've removed the root, we need to crawl back up the tree
  // and collapse each node that no longer has any leaf-nodes.
  self.$timeout(function() {
    for (var section, j = parentIndex - 1; j >= 0; j--) {
      section = sections[j];

      if (_.size(ptr[j][section]) === 0) {
          delete ptr[j][section];
      }
    }
  });
};
