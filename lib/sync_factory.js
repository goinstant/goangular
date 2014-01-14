/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Sync factory, responsible for creating and returning
 * instances of Sync.
 */

'use strict';

var Sync = require('./sync');

/**
 * syncFactory
 * @public
 * @param {Object} $parse - Angular parse
 * @param {Object} $timeout - Angular timeout
 * @returns {Function} option validation & instance creation
 */
module.exports = function syncFactory($parse, $timeout) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function(key, model) {
    return new Sync($parse, $timeout, key, model);
  };
};
