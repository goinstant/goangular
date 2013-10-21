/* jshint browser:true */
/* global require, module, goinstant */
/* exported platformProvider */

/**
 * @fileOverview
 *
 * This file contains the platformProvider service, which manages configuring
 * and connecting to Platform.
 */

'use strict';

var _ = require('lodash');
var errors = require('./errors');
var safeApply = require('./safe_apply');

/** @constant {Array} Whitelisted options */

var OPTIONS_WL = ['rooms', 'token'];

/**
 * platformProvider Service
 * @returns {Object}
 */

var platformProvider = module.exports = function() {

  var goOpts;

  return {

    /**
     * Called during AngularJS configuration stage to set Platform options
     * @public
     * @param{String} url - Platform connection Url
     * @param {Object} opts
     * @config {String|Array} rooms - Rooms which will be joined
     * @config {String} [token] - Platform user JWT
     * @example
     *   angularApp.config(function(platformProvider) {
     *     platformProvider.set('https://goinstant.net/YOURACCOUNT/YOURAPP');
     *   });
     */

    set: function(url, opts) {
      opts = opts || {};

      if (!_.isString(url)) {
        throw errors.create('platformProvider', 'INVALID_URL');
      }

      if (!_.isPlainObject(opts)) {
        throw errors.create('platformProvider', 'INVALID_OPTIONS');
      }

      if (optsInvalid(opts, OPTIONS_WL)) {
        throw errors.create('platformProvider', 'INVALID_ARGUMENT');
      }

      if (opts.rooms && !_.isArray(opts.rooms) && !_.isString(opts.rooms)) {
        throw errors.create('platformProvider', 'INVALID_ROOM');
      }

      if (opts.token && !_.isString(opts.token)) {
        throw errors.create('platformProvider', 'INVALID_TOKEN');
      }

      if (_.isString(opts.rooms)) {
        opts.rooms = [opts.rooms];
      }

      goOpts = { url: url, opts: opts };
    },

    /**
     * Opens a Platform connection and joins the rooms provided via
     * @public
     * the 'roomNames' option.
     * @param {Object} $q - Angular promise library
     * @param {Object} $scope - rootScope
     * @returns {Object} deferred - passed Platform object on resolution
     * @todo Refactor option handling
     */

    $get: ['$q', '$rootScope',  function($q, $rootScope) {
      if (!window.goinstant) {
        throw errors.create('platformProvider', 'MISSING_DEPENDENCY');
      }

      var deferred = $q.defer();

      goinstant.connect(goOpts.url, {
        rooms: goOpts.opts.rooms,
        token: goOpts.opts.token
      }, function(err, platform) {
        if (err) {
          return deferred.reject(err);
        }

        var rooms = {};

        _.each(_.toArray(arguments).slice(2), function(value) {
          rooms[value.name] = value;
        });

        safeApply($rootScope, function() {
          deferred.resolve({
            platform: platform,
            rooms: rooms
          });
        });
      });

      return deferred.promise;
    }]
  };
};

/* Helpers */

function optsInvalid(opts, valid_opts) {
  return _.difference(_.keys(opts), valid_opts).length;
}
