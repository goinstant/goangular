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
var KeyModel = require('./key_model');

module.exports = QueryModel;

/**
 * UsersModel
 *
 * @public
 */
function QueryModel($conn, key, $sync, factory) {
  _.bindAll(this);

  _.extend(this, {
    $$factory: factory,
    $$sync: $sync,
    $$conn: $conn,
    $$key: key,
    $$emitter: new Emitter(),
    $$index: []
  });
}

QueryModel.prototype = inherit(KeyModel.prototype);
