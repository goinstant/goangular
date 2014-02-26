/* jshint browser:true */
/* global require, module */

'use strict';

var Model = require('./model');
var Args = require('./util/args');

module.exports = function usersFactory($usersSync, $conn) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function $users() {
    var a = new Args([
      { room: Args.STRING | Args.Optional },
    ], arguments);

    var key = $conn.$key('.users', a.room);
    var sync = $usersSync(key);

    return new Model($conn, key, sync, $users);
  };
};
