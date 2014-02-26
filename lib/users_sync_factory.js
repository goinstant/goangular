/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Users Sync factory, responsible for creating and
 * returning instances of UserSync.
 */

'use strict';

var UsersSync = require('./users_sync');

module.exports = function usersSync($parse, $timeout) {

  /**
   * @public
   */
  return function(key) {
    return new UsersSync($parse, $timeout, key);
  };
};
