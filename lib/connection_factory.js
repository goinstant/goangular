/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Connection factory, responsible for the connection
 * singleton
 */

'use strict';

var Connection = require('./connection');
var connection;

module.exports = function connectionFactory() {
  connection = connection || new Connection();

  return connection;
};
