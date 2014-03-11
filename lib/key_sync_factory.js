/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the keySync factory, used to create a new instance of
 * KeySync.
 */

'use strict';

var KeySync = require('./key_sync');

module.exports = function keySync($parse, $timeout) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function(key) {
    return new KeySync($parse, $timeout, key);
  };
};
