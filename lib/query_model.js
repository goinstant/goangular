/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Query Factory & Model, responsible for creating and
 * returning instances of the GoAngular Query Model.
 */

'use strict';

var _ = require('lodash');
var Emitter = require('emitter');
var Args = require('./util/args');

var LOCAL_EVENTS = ['ready', 'error'];
var $key;

/**
 * queryFactory
 * @public
 * @param {Object} $sync - Responsible for synchronizing query model
 * @param {Object} $conn - GoInstant connection
 * @param {Function} $goKey - Uses to create GoAngular key model
 * @returns {Function} option validation & instance creation
 */
module.exports = function queryFactory($sync, $conn, $goKey) {
  $key = $goKey;

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function() {
    var a = new Args([
      { key: Args.OBJECT | Args.STRING | Args.Required },
      { room: Args.STRING | Args.Optional },
      { filter: Args.OBJECT | Args.Required },
      { options: Args.OBJECT | Args.Required }
    ], arguments);

    return new QueryModel($sync, $conn, a.key, a.room, a.filter, a.options);
  };
};

function QueryModel($querySync, $connection, key, room, filter, options) {
  _.bindAll(this);

  // If a key is provided, use it, otherwise create one
  key = (_.isObject(key) ? key : $connection.$key(key, room));

  _.extend(this, {
    $$querySync: $querySync,
    $$connection: $connection,
    $$key: key,
    $$query: key.query(filter, options),
    $$emitter: new Emitter(),
    $$index: []
  });
}

/**
 * Primes our model, fetching the current result set and monitoring it for
 * changes.
 * @public
 */
QueryModel.prototype.$sync = function() {
  var self = this;

  var connected = self.$$connection.$ready();

  connected.then(function() {
    self.$$sync = self.$$querySync(self.$$query, self);
    self.$$sync.$initialize();
  });

  connected.fail(function(err) {
    self.$$emitter.emit('error', err);
  });

  return self;
};

/**
 * Add a generated id with a

 * @param {*} value - New value of key
 * @returns {Object} promise
 */
QueryModel.prototype.$add = function(value, opts) {
  opts = opts || {};

  var self = this;
  return this.$$connection.$ready().then(function() {
    return self.$$key.add(value, opts);
  });
};

/**
 * Give the current key a new value
 * @public
 * @param {*} value - New value of key
 * @returns {Object} promise
 */
QueryModel.prototype.$set = function(value, opts) {
  opts = opts || {};

  var self = this;
  return this.$$goConnection.$ready().then(function() {
    return self.$$key.set(value, opts);
  });
};

/**
 * Returns a new object that does not contain prefixed methods
 * @public
 * @returns {Object} model
 */
QueryModel.prototype.$omit = function() {
  return _.omit(this, function(value, key){
    return _.first(key) === '$';
  });
};

/**
 * Create and return a new instance of Model, with a relative key.
 * @public
 * @param {String} keyName - Key name
 */
QueryModel.prototype.$key = function(keyName) {
  var key = this.$$key.key(keyName);

  return $key(key);
};

/**
 * Remove this key
 * @public
 * @returns {Object} promise
 */
QueryModel.prototype.$remove = function(opts) {
  opts = opts || {};

  var self = this;
  return this.$$connection.$ready().then(function() {
    return self.$$key.remove(opts);
  });
};

/**
 * Bind a listener to events on this key
 * @public
 */
QueryModel.prototype.$on = function(eventName, listener) {
  if (!_.contains(LOCAL_EVENTS, eventName)) {
    return this.$$query.on(eventName, listener);
  }

  this.$$emitter.on(eventName, listener);
};

/**
 * Remove a listener on this key
 * @public
 */
QueryModel.prototype.$off = function(eventName, listener) {
  if (!_.contains(LOCAL_EVENTS, eventName)) {
    return this.$$query.off(eventName, listener);
  }

  this.$$emitter.off(eventName, listener);
};
