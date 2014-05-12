/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the users factory, responsible for validating options and
 * creating a new instance of the UsersModel.
 */

'use strict';

var UsersModel = require('./users_model');
var Args = require('args-js');

/**
 * usersFactory
 * @public
 * @param {Object} keySync Responsible for synchronizing an Angular model,
 * with an angular key.
 * @param {Function} goKey Factory function for creating a new instance of the
 *                         KeyModel
 * @param {Object} conn GoInstant connection service
 * @param {Function} goSelf Factory function for creating a new instance of the
 *                   SelfModel
 * @returns {Function} option validation & instance creation
 */
module.exports = function usersFactory($usersSync, $goKey, $conn, $q) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function $key() {
    var a = new Args([
      { room: Args.STRING | Args.Optional }
    ], arguments);

    var key = $conn.$key('.users', a.room);
    var sync = $usersSync(key);

    return new UsersModel($conn, key, sync, $goKey, $q);
  };
};
