/* jshint browser: true */
/* global require, module */
/* exported ModelBinder */

/**
 * @fileOverview
 *
 * This file contains the ModelBinder class, which is responsible for
 * associating a model in scope (so anything $scope[here]) with a goinstant key.
 */

'use strict';

var _ = require('lodash');
var async = require('async');
var bounceProtection = require('./bounce_protection');
var safeApply = require('./safe_apply');

module.exports = ModelBinder;

/**
 * ModelBinder instantiated with a controllers scope and unique key
 * @private
 * @constructor
 * @param {Object} $scope - Angular controller scope
 * @param {Object} $parse - Angular parse object
 * @param {Object} key - Key unique to the controller scope
 * @returns {Object} modelBinder
 */
function ModelBinder($scope, $parse, key) {
  this._scope = $scope;
  this._parse = $parse;
  this._key = key;
  this._bindings = [];
  this._stopWatchs = [];

  _.bindAll(this, ['_generateModel', 'newBinding', '_keySetHandler']);
}

/**
 * Creates an association between a model in $scope and a key in goinstant by
 * fetching an existing value, monitoring the local scope, and listening for
 * changes on this value in goinstant.
 * @private
 * @param {String} modelName - Name of the model in scope and the goinstant key
 * @param {requestCallback} [cb]- The callback that handles the response.
 */
ModelBinder.prototype.newBinding = function(modelName, cb) {
  var self = this;
  var model = self._generateModel(modelName);
  var boundFuncs = _.map([
    '_firstFetch',
    '_localMonitor',
    '_remoteMonitor'
    ], function(funcName) {
      return _.bind(self[funcName], self, model);
    }
  );

  async.parallel(boundFuncs, cb);
};

/**
 * Generates a model with get/set functions powered by $parse
 * @private
 * @param {String} modelName - Name of the model in scope and the goinstant key
 */
ModelBinder.prototype._generateModel = function(modelName) {
  var model = {};

  model.name = modelName;
  model.parsed = this._parse(modelName);
  model.get = _.bind(model.parsed, model, this._scope);
  model.set = _.curry(model.parsed.assign)(this._scope);

  return model;
};


/**
 * Attempts to retrieve a value from goinstant, if none exists it uses the
 * existing value as a default.
 * @private
 * @param {String} modelName - Name of the model in scope and the goinstant key
 * @param {requestCallback} next- The callback that handles the response.
 */
ModelBinder.prototype._firstFetch = function(model, next) {
  var self = this;

  var key = this._key.key(model.name);
  var modelDefault = model.get();

  // fetch the initial value of the model
  key.get(function(err, value) {
    if (err) {
      return next(err);
    }

    var hasDefault = (!_.isUndefined(modelDefault) && !_.isNull(modelDefault));
    var hasValue = (!_.isUndefined(value) && !_.isNull(value));

    if (!hasDefault && !hasValue) {
      return next();
    }

    if (hasDefault && !hasValue) {
      return key.set(modelDefault, next);
    }

    safeApply(self._scope, function() {
      model.set(value);
      next();
    });
  });
};

/**
 * Adds a listener to the $watch table
 * @private
 * @param {String} modelName - Name of the model in scope and the goinstant key
 * @param {requestCallback} next - The callback that handles the response.
 * @todo It might be easier to test change validation in isolation
 */
ModelBinder.prototype._localMonitor = function(model, next) {
  var self = this;
  var key = self._key.key(model.name);

  // stopWatch represents a function that when invoked removes our listener
  var stopWatch = self._scope.$watch(model.name, function(newVal, oldVal) {
    if (!_.isUndefined(newVal) && newVal !== oldVal) {
      return bounceProtection.local(function() {
        key.set(newVal);
      });
    }

    key.remove(function(err) {
      self._scope.$emit('goangular:error', err);
    });
  }, true);

  self._stopWatchs.push(stopWatch);
  next();
};

/**
 * Monitor goinstant key changes
 * @private
 * @param {String} modelName - Name of the model in scope and the goinstant key
 * @param {requestCallback} next - The callback that handles the response.
 * @todo Initial monitoring should only be called once, additional calls
 * should add the modelName to an array of modelNames to validate against
 */
ModelBinder.prototype._remoteMonitor = function(model, next) {
  if (this._monitoringRemote) {
    return next();
  }

  var self = this;

  self._monitoringRemote = true;
  self._key.on('set', {
    bubble: true,
    listener: self._keySetHandler
  }, next);
};

/**
 * When the value of the key has changed, we update the associated $scope[model]
 * @private
 * @param {*} value - New key value
 * @param {Object} context - Information related to the key being set
 */
ModelBinder.prototype._keySetHandler = function(value, context) {
  var self = this;

  bounceProtection.remote(function() {
    var modelName = self._keyToModel(context.key);
    var model = self._generateModel(modelName);

    safeApply(self._scope, function() {
      model.set(value);
    });
  });
};

/**
 * Returns the model name when passed a key so:
 * key: '/uniqueControllerKey/modelName', becomes: 'modelName'
 * @private
 * @param {String} key - goinstant key
 * @returns {String} modelName
 */
ModelBinder.prototype._keyToModel = function(key) {
  return _.last(key.split('/'));
};

/**
 * Removes the set listener from the key and invokes every stopwatch
 * @private
 * @param {String} key - goinstant key
 * @param {requestCallback} next - The callback that handles the response.
 */
ModelBinder.prototype.cleanup = function(cb) {
  var self = this;

  self._key.off('set', self._keySetHandler, function(err) {
    if (err) {
      return cb(err);
    }

    _.invoke(self._stopWatchs, Function.prototype.call);
    cb();
  });
};
