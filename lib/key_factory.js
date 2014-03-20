/* jshint browser:true, bitwise: false */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Sync factory, responsible for creating and returning
 * instances of Sync.
 */

'use strict';

var Model = require('./model');
var Args = require('args-js');
var _ = require('lodash');

/**
 * keyFactory
 * @public
 * @param {Object} $keySync - Responsible for synchronizing an Angular model,
 * with an angular key.
 * @param {Object} $conn - GoInstant connection service
 * @returns {Function} option validation & instance creation
 */
module.exports = function keyFactory($keySync, $conn) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function $key() {
    var a = new Args([
      { key: Args.OBJECT | Args.STRING | Args.Required },
      { room: Args.STRING | Args.Optional },
    ], arguments);

    var key = _.isObject(a.key) ? a.key : $conn.$key(a.key, a.room);
    var sync = $keySync(key);

    return new Model($conn, key, sync, $key);
  };
};
