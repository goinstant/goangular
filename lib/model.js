/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Model class, an Angular friendly base key wrapper
 */

'use strict';

var _ = require('lodash');
var Emitter = require('emitter-component');

module.exports = Model;

var LOCAL_EVENTS = ['ready', 'error'];

/**
 * Instantiated by a factory or $key method the constructor accepts a key,
 * which it extends with convenience methods.
 *
 * @public
 * @constructor
 * @class
 * @param {Object} $sync - Must implement synchronization interface
 * @param {Object} $conn - GoInstant connection service
 * @param {Object|String} key - GoInstant Key or string key name
 * @param {function} factory - a factory for creating new models.
 */
function Model($conn, key, $sync, factory) {
  _.bindAll(this, [
    '$sync',
    '$key',
    '$omit',
    '$on',
    '$off'
  ]);

  _.extend(this, {
    $$factory: factory,
    $$sync: $sync,
    $$conn: $conn,
    $$key: key,
    $$emitter: new Emitter(),
    $$index: []
  });
}

/**
 * Primes our model, fetching the current key value and monitoring it for
 * changes.
 */
Model.prototype.$sync = function() {
  var self = this;

  var connected = self.$$conn.$ready();

  connected.then(function() {
    self.$$sync.$initialize(self);
  });

  connected.fail(function(err) {
    self.$$emitter.emit('error', err);
  });

  return self;
};

/**
 * Create and return a new instance of Model, with a relative key.
 * @public
 * @param {String} keyName - Key name
 */
Model.prototype.$key = function(keyName) {
  var key = this.$$key.key(keyName);

  return this.$$factory(key);
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
    throw new Error('Invalid event name: ' + eventName);
  }

  this.$$emitter.on(eventName, listener);
};

/**
 * Remove a listener on this key
 * @public
 */
Model.prototype.$off = function(eventName, listener) {
  if (!_.contains(LOCAL_EVENTS, eventName)) {
    throw new Error('Invalid event name: ' + eventName);
  }

  this.$$emitter.off(eventName, listener);
};
