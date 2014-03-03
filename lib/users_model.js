/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the UsersModel class, an Angular friendly users key
 * wrapper.
 */

'use strict';

var _ = require('lodash');
var Model = require('./model');
var KeyModel = require('./key_model');

module.exports = UsersModel;

var USER_EVENTS = ['join', 'leave'];

/**
 * UsersModel
 *
 * @public
 */
function UsersModel() {
  Model.apply(this, arguments);
}

UsersModel.prototype = new Model();
UsersModel.prototype.constructor = UsersModel;

UsersModel.prototype.$self = function() {
  var key = this.$$key.room().self();

  return this.$$factory(key);
};

UsersModel.prototype.$getUser = function(id) {
  var key = this.$$key.room().user(id);

  return this.$$factory(key);
};

UsersModel.prototype.$on = function(eventName, opts, listener) {
  if (_.contains(USER_EVENTS, eventName)) {
    return this.$$key.room().on(eventName, opts, listener);
  }

  KeyModel.prototype.$on.apply(this, arguments);
};

UsersModel.prototype.$off = function(eventName, opts, listener) {
  if (_.contains(USER_EVENTS, eventName)) {
    return this.$$key.room().off(eventName, opts, listener);
  }

  KeyModel.prototype.$off.apply(this, arguments);
};
