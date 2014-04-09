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
 * @public
 * @constructor
 * @class
 * @extends Model
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
 * @extends Model#$on
 */
KeyModel.prototype.$on = function(eventName, opts, listener) {
  if (_.contains(KEY_EVENTS, eventName)) {
    return this.$$key.on(eventName, opts, listener);
  }

  Model.prototype.$on.call(this, eventName, opts);
};

/**
 * Remove a listener on this key. If the eventName is empty call off on both the
 * key and the model (Model.prototype.off).
 * @public
 * @extends Model#$off
 */
KeyModel.prototype.$off = function(eventName, opts, listener) {
  if (_.contains(KEY_EVENTS, eventName)) {
    return this.$$key.off(eventName, opts, listener);

  } else if (!eventName) {
    this.$$key.off(eventName, opts, listener);
  }

  Model.prototype.$off.call(this, eventName, opts);
};
