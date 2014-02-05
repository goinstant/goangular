/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Model class, an Angular friendly key wrapper
 */

'use strict';

var _ = require('lodash');
var Emitter = require('emitter');

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
 */
function Model($conn, key, $sync) {
  _.bindAll(this);

  _.extend(this, {
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

  return new Model(this.$$conn, key, this.$$sync);
};

/**
 * Give the current key a new value
 * @public
 * @param {*} value - New value of key
 * @returns {Object} promise
 */
Model.prototype.$set = function(value, opts) {
  opts = opts || {};

  var self = this;
  return this.$$conn.$ready().then(function() {
    return self.$$key.set(value, opts);
  });
};

/**
 * Add a generated id with a
 * @public
 * @param {*} value - New value of key
 * @returns {Object} promise
 */
Model.prototype.$add = function(value, opts) {
  opts = opts || {};

  var self = this;
  return this.$$conn.$ready().then(function() {
    return self.$$key.add(value, opts);
  });
};

/**
 * Remove this key
 * @public
 * @returns {Object} promise
 */
Model.prototype.$remove = function(opts) {
  opts = opts || {};

  var self = this;
  return this.$$conn.$ready().then(function() {
    return self.$$key.remove(opts);
  });
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
