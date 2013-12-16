/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Connection factory, responsible for the connection
 * singleton
 */

'use strict';

var Sync = require('./sync');

module.exports = function syncFactory($parse) {
  return function(scope, model, key) {
    // validate things
    return new Sync($parse, scope, model, key);
  };
};
