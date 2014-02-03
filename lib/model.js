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
 * @param {Object} $goConnection - GoInstant connection service
 * @param {Object|String} key - GoInstant Key or string key name
 * @param {String} room - Room name
 * @example
 *   $scope.todos = $goSync('todos').$sync();
 */
function Model($goSync, $goConnection, key, room) {
  _.bindAll(this);

  // If a key is provided, use it, otherwise create one
  key = (_.isObject(key) ? key : $goConnection.$key(key, room));

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
  var self = this;

  var connected = self.$$goConnection.$ready();

  connected.then(function() {
    self.$$sync = self.$$goSync(self.$$key, self);
    self.$$sync.$initialize();
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

  return new Model(this.$$goSync, this.$$goConnection, key);
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
  return this.$$goConnection.$ready().then(function() {
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
  return this.$$goConnection.$ready().then(function() {
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
  return this.$$goConnection.$ready().then(function() {
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
Model.prototype.$on = function(eventName, opts, listener) {
  if (!_.contains(LOCAL_EVENTS, eventName)) {
    return this.$$key.on(eventName, opts, listener);
  }

  // Overloaded method, opts = listener
  this.$$emitter.on(eventName, opts);
};

/**
 * Remove a listener on this key
 * @public
 */
Model.prototype.$off = function(eventName, opts, listener) {
  if (!_.contains(LOCAL_EVENTS, eventName)) {
    return this.$$key.off(eventName, opts, listener);
  }

  // Overloaded method, opts = listener
  this.$$emitter.off(eventName, opts);
};
