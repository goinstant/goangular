/* jshint browser:true, bitwise: false */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Key factory, responsible for validating options and
 * creating a new instance of the KeyModel.
 */

'use strict';

var KeyModel = require('./key_model');
var Args = require('args-js');
var _ = require('lodash');

module.exports = keyFactory;

/**
 * keyFactory
 * @public
 * @param {Object} $keySync - Responsible for synchronizing an Angular model,
 * with an angular key.
 * @param {Object} $conn - GoInstant connection service
 * @returns {Function} option validation & instance creation
 */
function keyFactory($keySync, $conn) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function $key() {
    var a = new Args([
      { key: Args.OBJECT | Args.STRING | Args.Required },
      { room: Args.STRING | Args.Optional }
    ], arguments);

    var key = (_.isObject(a.key)) ? a.key : $conn.$key(a.key, a.room);
    var sync = $keySync(key);

    return new KeyModel($conn, key, sync, $key);
  };
}
