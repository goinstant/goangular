/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Sync class, used to create a two-way binding between
 * a model on $scope and a GoInstant key
 */

'use strict';

/* @todo slowly phase out external dependencies */
var _ = require('lodash');
var Q = require('q');

var bounceProtection = require('./bounce_protection');
var safeApply = require('./safe_apply');

module.exports = Sync;

/**
 * Instantiated by the Sync factory, the constructor takes a scope, model name
 * and key.  It synchronizes the model and key.
 * @public
 * @constructor
 * @class
 * @example
 *  goSync($scope, 'todos', lobby.key('todos'));
 */
function Sync($parse, scope, modelName, key) {
  var self = this;

  _.bindAll(self, [
    '_generateModel',
    '_firstFetch',
    '_localMonitor',
    '_remoteMonitor',
    '_keySetHandler'
  ]);

  _.extend(self, {
    _parse: $parse,
    _scope: scope,
    _modelName: modelName,
    _key: key,
    _stopWatch: null
  });

  self._model = self._generateModel();
}

Sync.prototype.initialize = function() {
  return _.reduce([
    this._firstFetch,
    this._localMonitor,
    this._remoteMonitor
  ], Q.when, {});
};

/**
 * Generates a model with get/set functions powered by $parse
 * @private
 */
Sync.prototype._generateModel = function() {
  var model = {};

  model.name = this._modelName;
  model.parsed = this._parse(this._modelName);
  model.get = _.bind(model.parsed, model, this._scope);
  model.set = _.curry(model.parsed.assign)(this._scope);

  return model;
};

/**
 * Attempts to retrieve a value from goinstant, if none exists it uses the
 * existing value as a default.
 * @private
 */
Sync.prototype._firstFetch = function() {
  var self = this;

  return self._key.get().get('value').then(function(value) {
    var modelDefault = self._model.get();

    var hasDefault = (!_.isUndefined(modelDefault) && !_.isNull(modelDefault));
    var hasValue = (!_.isUndefined(value) && !_.isNull(value));

    if (!hasDefault && !hasValue) {
      return;
    }

    if (hasDefault && !hasValue) {
      return self._key.set(modelDefault);
    }

    return safeApply(self._scope, function() {
      self._model.set(value);
    });
  });
};

/**
 * Adds a local change listener to the $watch table
 * @private
 */
Sync.prototype._localMonitor = function() {
  var self = this;

  function scopeChange(newVal, oldVal) {
    if (newVal === oldVal) {
      return;
    }

    if (!_.isUndefined(newVal)) {
      return bounceProtection.local(function() {
        self._key.set(newVal);
      });
    }

    self._key.remove(function(err) {
      self._scope.$emit('goangular:error', err);
    });
  }

  self._stopWatch = self._scope.$watch(self._model.name, scopeChange, true);
};

/**
 * Monitor goinstant key changes
 * @private
 */
Sync.prototype._remoteMonitor = function() {
  this._monitoringRemote = true;
  this._key.on('set', this._keySetHandler);
};

/**
 * When the value of the key has changed, we update the associated $scope[model]
 * @private
 * @param {*} value - New key value
 * @param {Object} context - Information related to the key being set
 */
Sync.prototype._keySetHandler = function(value) {
  var self = this;

  bounceProtection.remote(function() {
    safeApply(self._scope, function() {
      self._model.set(value);
    });
  });
};

/**
 * Clean up listeners
 * @public
 */
Sync.prototype.destroy = function() {
  console.log('destroyed?')
  this._stopWatch();
  this._key.off('set', this._keySetHandler);
};
