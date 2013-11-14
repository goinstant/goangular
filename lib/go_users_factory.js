/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the GoUser class which provides a set of low level methods
 * used to manage GoInstant users.
 */

'use strict';

var _ = require('lodash');
var errors = require('./errors');
var GoUsers = require('./go_users');

/**
 * This function is registered as a factory with Angular in ../index.js
 * @private
 * @param {Object} $rootScope - use to emit & broadcast events
 * @param {Object} $q - Angular promise library
 * @param {Object} goConnect - GoInstant connection object
 * @returns {Object}
 */
module.exports = function GoUsersFactory($rootScope, $q, goConnect) {
  // container for goUsers instances
  var instances = {};

  /**
   * room returns an instance of GoUsers associated with the room specified
   * @public
   * @param {String} room - To maintain consistency with the GoInstant API we
   * provide a `room` method, used to specify the room you wish to connect to.
   *
   * @example
   *   goUsers.room('YOUROOM').initialize().then(...
   */
  return {
    room: function(room) {
      if (room && !_.isString(room)) {
        throw errors.create('goUsers', 'INVALID_ROOM');
      }

      room = room || 'lobby';

      if (instances[room]) {
        return instances[room];
      }

      instances[room] = new GoUsers($rootScope, $q, goConnect, room);

      return instances[room];
    }
  };
};
