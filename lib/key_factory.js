/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Sync factory, responsible for creating and returning
 * instances of Sync.
 */

'use strict';

var Model = require('./model');
var errors = require('./errors');

/**
 * keyFactory
 * @public
 * @param {Object} $goSync - Responsible for synchronizing an Angular model,
 * with an angular key.
 * @param {Object} $goConnection - GoInstant connection service
 * @returns {Function} option validation & instance creation
 */
module.exports = function keyFactory($goSync, $goConnection) {

  /**
   * @public
   * @param {Object} key - GoInstant key
   */
  return function(key, room) {

    if (!key) {
      throw errors.create('$goKey', 'INVALID_ARGUMENT');
    }

    return new Model($goSync, $goConnection, key, room);
  };
};
