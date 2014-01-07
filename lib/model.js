/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Model class, an Angular friendly key wrapper
 */

'use strict';

/* @todo slowly phase out external dependencies */
var _ = require('lodash');
var Emitter = require('emitter');

module.exports = Model;

var LOCAL_EVENTS = ['ready', 'error'];

/**
 * Instantiated by the key_factory or $key method the constructor accepts a key,
 * which it extends with synchronization and convenience methods.
 *
 * @public
 * @constructor
 * @class
 * @param {Object} $goSync - Responsible for synchronizing an Angular model,
 * with an angular key.
 * @param {Object} $goConnect - GoInstant connection service
 * @param {Object} key - GoInstant Key
 * @example
 *   $scope.todos = $goSync(lobby.key('todos')).$get();
 */
function Model($goSync, $goConnection, key) {
  _.bindAll(this);

  _.extend(this, {
    $$goSync: $goSync,
    $$goConnection: $goConnection,
    $$key: key,
    $$emitter: new Emitter()
  });
}

/**
 * Primes our model, fetching the current key value and monitoring it for
 * changes.
 */
Model.prototype.$sync = function() {
  this.$$sync = this.$$goSync(this.$$key, this);
  this.$$sync.$initialize();

  return this;
};

/**
 * Create and return a new instance of Model, with a relative key.
 * @public
 * @param {Object} keyName - Goinstant key name
 */
Model.prototype.$key = function(keyName) {
  var key = this.$$key.key(keyName);

  return new Model(this.$$goSync, this.$$goConnection, key);
};

/**
 * Give the current key a new value
 * @public
 * @param {*} value - New value of key
 * @returns {Object} promise
 */
Model.prototype.$set = function(value) {
  return this.$$key.set(value);
};

/**
 * Add a generated id with a
 * @public
 * @param {*} value - New value of key
 * @returns {Object} promise
 */
Model.prototype.$add = function(value) {
  return this.$$key.add(value);
};

/**
 * Remove this key
 * @public
 * @returns {Object} promise
 */
Model.prototype.$remove = function() {
  return this.$$key.remove();
};

/**
 * Returns a new object that does not contain prefixed methods
 * @public
 * @returns {Object} model
 */
Model.prototype.$omit = function() {
  return _.omit(this, function(value, key){
    return _.first(key) === '$';
  });
};

/**
 * Bind a listener to events on this key
 * @public
 */
Model.prototype.$on = function(eventName, listener) {
  if (!_.contains(LOCAL_EVENTS, eventName)) {
    return this.$$key.on(eventName, listener);
  }

  this.$$emitter.on(eventName, listener);
};

/**
 * Remove a listener on this key
 * @public
 */
Model.prototype.$off = function(eventName, listener) {
  if (!_.contains(LOCAL_EVENTS, eventName)) {
    return this.$$key.off(eventName, listener);
  }

  this.$$emitter.off(eventName, listener);
};
