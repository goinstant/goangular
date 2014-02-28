/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Users factory, responsible for creating and returning
 * instances of a users key model.
 */

'use strict';

var Model = require('./model');
var Args = require('./util/args');
var _ = require('lodash');

/**
 * usersFactory
 * @public
 * @param {Object} $usersSync - Responsible for synchronizing an Angular model,
 * with a .users GoInstant key.
 * @param {Object} $conn - GoInstant connection service
 * @returns {Function} option validation & instance creation
 */
module.exports = function userFactory($goKey, $keySync, $conn) {

  /**
   * @public
   * @param {Object} room - GoInstant room
   */
  return function $user() {
    var a = new Args([
      { key: Args.OBJECT | Args.STRING | Args.Required },
      { room: Args.STRING | Args.Optional },
    ], arguments);

    var key = _.isObject(a.key) ? a.key : $conn.$key('.users/' + a.key, a.room);
    var sync = $keySync(key);

    return new Model($conn, key, sync, $goKey);
  };
};
