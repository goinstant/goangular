/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the KeyModel class, an Angular friendly key wrapper
 */

'use strict';

var _ = require('lodash');
var Model = require('./model');

module.exports = KeyModel;

var KEY_EVENTS = ['add', 'set', 'remove'];

/**
 * KeyModel
 *
 * @public
 */
function KeyModel() {
  Model.apply(this, arguments);
}

KeyModel.prototype = new Model();
KeyModel.prototype.constructor = KeyModel;

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

KeyModel.prototype.$on = function(eventName, opts, listener) {
  if (_.contains(KEY_EVENTS, eventName)) {
    return this.$$key.on(eventName, opts, listener);
  }

  Model.prototype.$on.call(this, eventName, opts || listener);
};

KeyModel.prototype.$off = function(eventName, opts, listener) {
  if (_.contains(KEY_EVENTS, eventName)) {
    return this.$$key.off(eventName, opts, listener);
  }

  Model.prototype.$off.call(this, eventName, opts || listener);
};
