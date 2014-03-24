/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the usersSync factory, used to create a new instance of
 * UsersSync.
 */

'use strict';

var UsersSync = require('./users_sync');

module.exports = usersSyncFactory;

function usersSyncFactory($parse, $timeout) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function(key) {
    return new UsersSync($parse, $timeout, key);
  };
}
