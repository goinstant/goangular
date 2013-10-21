/* jshint browser:true */
/* global module */
/* exported safeApply */

/**
 * @fileOverview
 *
 * This file contains the safeApply helper, it prevents a call to apply if
 * a digest is already in progress
 */

'use strict';

/**
 * safeApply
 * @param {Object} $scope - Angular scope
 * @param {requestCallback} fn - function passed to apply
 * @callback
 */
var safeApply = module.exports = function($scope, fn) {
  var phase = $scope.$root && $scope.$root.$$phase;

  if (phase === '$apply' || phase === '$digest') {
    return $scope.$eval(fn);
  }

  if (!fn) {
    return $scope.$apply();
  }

  $scope.$apply(fn);
};

