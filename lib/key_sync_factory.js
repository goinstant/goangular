/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the keySync factory, used to create a new instance of
 * KeySync
 */

'use strict';

var KeySync = require('./key_sync');

module.exports = keySyncFactory;

/**
 * @param {Object} $parse - Angular parse object
 * @param {Object} $timeout - Angular timeout object
 * @returns {Function} KeySync factory
 */
function keySyncFactory($parse, $timeout) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function(key) {
    return new KeySync($parse, $timeout, key);
  };
}
