/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Key Sync factory, responsible for creating and
 * returning instances of KeySync.
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
