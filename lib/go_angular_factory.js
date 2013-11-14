/* jshint browser: true */
/* global require, module */
/* exported goAngularFactory */

/**
 * @fileOverview
 *
 * This file contains the goAngular factory provider, which validates options
 * options being passed to the goAngular constructor before returning a new
 * goAngular instance.
 */

'use strict';

var _ = require('lodash');
var errors = require('./errors');
var GoAngular = require('./go_angular');

/** @constant {Array} Whitelisted options */

var OPTIONS_WL = ['room', 'include', 'exclude'];

/**
 * goAngularFactory
 * @public
 * @param {Object} $q - Angular promise library
 * @param {Object} $parse - Angular parse
 * @param {Object} goConnect - goConnect service
 * @returns {Function} option validation & instance creation
 */
var goAngularFactory = module.exports = function($q, $parse, goConnect) {

  /**
   * @public
   * @param {Object} opts - see GoAngular documentation for further details
   */
  return function(scope, namespace, opts) {
    opts = opts || {};

    if (!_.isPlainObject(opts)) {
      throw errors.create('goAngularFactory', 'INVALID_OPTIONS');
    }

    if (optsInvalid(opts, OPTIONS_WL)) {
      throw errors.create('goAngularFactory', 'INVALID_ARGUMENT');
    }

    if (!_.isObject(scope)) {
      throw errors.create('goAngularFactory', 'INVALID_SCOPE');
    }

    if (!_.isString(namespace)) {
      throw errors.create('goAngularFactory', 'INVALID_KEY');
    }

    if (opts.room) {
      if (!_.isString(opts.room) && !(opts.room instanceof goinstant.Room)) {
        throw errors.create('goAngularFactory', 'INVALID_ROOM');
      }
    }

    if (opts.include && !_.isArray(opts.include)) {
      throw errors.create('goAngularFactory', 'INVALID_INCLUDE');
    }

    if (opts.exclude && !_.isArray(opts.exclude)) {
      throw errors.create('goAngularFactory', 'INVALID_EXCLUDE');
    }

    return new GoAngular(scope, namespace, opts, $q, $parse, goConnect);
  };
};

/* Helpers */

function optsInvalid(opts, valid_opts) {
  return _.difference(_.keys(opts), valid_opts).length;
}
