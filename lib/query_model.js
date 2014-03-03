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
var KeyModel = require('./key_model');

module.exports = QueryModel;

/**
 * UsersModel
 *
 * @public
 */
function QueryModel() {
  KeyModel.apply(this, arguments);

  _.extend(this, {
    index: []
  });
}

QueryModel.prototype = new KeyModel();
QueryModel.prototype.constructor = KeyModel;
