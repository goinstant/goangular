/* jshint browser: true */
/* global exports */
/* exported bounceProtection */

/**
 * @fileOverview
 *
 * This file contains a helper designed to prevent infinite bounce backs a la:
 * $watch fires -> key.set -> key.on -> $scope set -> $watch fires ...
 */

'use strict';

var bounceProtection = exports;
exports.constructor = function bounceProtection() {};

bounceProtection.remoteUpdate = false; // remote toggle

/**
 * Invoke cb while a remote update is not currently being executed
 * @private
 * @param {requestCallback} cb - The callback that handles the response.
 * @example
 *   bounceProtection.local(function() {
 *     key.set(newValue);
 *   });
 */
bounceProtection.local = function(cb) {
  if (this.remoteUpdate) {
    return;
  }

  cb();
};

/**
 * Invoke a cb while remoteUpdate is enabled to prevent a local function
 * from being triggered
 * @private
 * @param {requestCallback} cb - The callback that handles the response.
 * @example
 *   bounceProtection.remote(function() {
 *     $scope.someModel = value;
 *   });
 */
bounceProtection.remote = function(cb) {
  this.remoteUpdate = true;
  cb();
  this.remoteUpdate = false;
};
