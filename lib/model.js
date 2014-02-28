/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Model class, an Angular friendly base wrapper
 */

'use strict';

var _ = require('lodash');
var Emitter = require('emitter');

module.exports = Model;

var USER_EVENTS = ['join', 'leave'];
var KEY_EVENTS = ['add', 'set', 'remove'];

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
function Model($conn, key, $sync, factory) {
  _.bindAll(this);

  _.extend(this, {
    $$factory: factory,
    $$sync: $sync,
    $$conn: $conn,
    $$key: key,
    $$emitter: new Emitter(),
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
Model.prototype.$on = function(eventName, opts, listener) {
  if (_.contains(KEY_EVENTS, eventName)) {
    return this.$$key.on(eventName, opts, listener);
  }

  if (_.contains(USER_EVENTS, eventName)) {
    return this.$$key.room().on(eventName, opts, listener);
  }

  // Overloaded method, opts = listener
  this.$$emitter.on(eventName, opts);
};

/**
 * Remove a listener on this key
 * @public
 */
Model.prototype.$off = function(eventName, opts, listener) {
  if (_.contains(KEY_EVENTS, eventName)) {
    return this.$$key.off(eventName, opts, listener);
  }

  if (_.contains(USER_EVENTS, eventName)) {
    return this.$$key.room().off(eventName, opts, listener);
  }

  // Overloaded method, opts = listener
  this.$$emitter.off(eventName, opts);
};
