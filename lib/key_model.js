/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the KeyModel class, an Angular friendly key wrapper
 */

'use strict';

var _ = require('lodash');
var inheritPrototype = require('./util/inherit');
var Model = require('./model');

module.exports = KeyModel;

var KEY_EVENTS = ['set', 'add', 'remove'];

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
function KeyModel() {
  Model.apply(this, arguments);

  _.bindAll(this, [
    '$set',
    '$add',
    '$remove',
    '$on',
    '$off'
  ]);
}

inheritPrototype(KeyModel, Model);

/**
 * Give the current key a new value
 * @public
 * @param {*} value - New value of key
 * @returns {Object} promise
 */
KeyModel.prototype.$set = function(value, opts) {
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
KeyModel.prototype.$add = function(value, opts) {
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
KeyModel.prototype.$remove = function(opts) {
  opts = opts || {};

  var self = this;
  return this.$$conn.$ready().then(function() {
    return self.$$key.remove(opts);
  });
};

/**
 * Bind a listener to events on this key
 * @public
 * @extends Model#on
 */
KeyModel.prototype.$on = function(eventName, opts, listener) {
  if (!_.contains(KEY_EVENTS, eventName)) {
    return Model.prototype.$on.call(this, eventName, opts || listener);
  }

  this.$$key.on(eventName, opts, listener);
};

/**
 * Remove a listener on this key
 * @public
 * @extends Model#off
 */
KeyModel.prototype.$off = function(eventName, opts, listener) {
  if (!_.contains(KEY_EVENTS, eventName)) {
    return Model.prototype.$on.call(this, eventName, opts || listener);
  }

  this.$$key.off(eventName, opts, listener);
};
