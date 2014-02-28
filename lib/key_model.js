/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the KeyModel class, an Angular friendly key wrapper
 */

'use strict';

var _ = require('lodash');
var Emitter = require('emitter');
var inherit = require('./util/inherit');
var Model = require('./model');

module.exports = KeyModel;

/**
 * KeyModel
 *
 * @public
 */
function KeyModel($conn, key, $sync, factory) {
  _.bindAll(this);

  _.extend(this, {
    $$factory: factory,
    $$sync: $sync,
    $$conn: $conn,
    $$key: key,
    $$emitter: new Emitter()
  });
}

KeyModel.prototype = inherit(Model.prototype);

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
