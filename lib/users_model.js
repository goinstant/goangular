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
var Emitter = require('emitter');
var inherit = require('./util/inherit');
var Model = require('./model');

module.exports = UsersModel;

/**
 * UsersModel
 *
 * @public
 */
function UsersModel($conn, key, $sync, factory) {
  _.bindAll(this);

  _.extend(this, {
    $$factory: factory,
    $$sync: $sync,
    $$conn: $conn,
    $$key: key,
    $$emitter: new Emitter()
  });
}

UsersModel.prototype = inherit(Model.prototype);

UsersModel.prototype.$self = function() {
  var key = this.$$key.room().self();

  return this.$$factory(key);
};

UsersModel.prototype.$getUser = function(id) {
  var key = this.$$key.room().user(id);

  return this.$$factory(key);
};
