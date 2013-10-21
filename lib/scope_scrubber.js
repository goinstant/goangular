/* jshint browser: true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the ScopeScrubber class, which is responsible for removing
 * anything from scope that either (a) cannot be stored in platform, or (b)
 * the user specifies shouldn't be stored in platform.
 */

'use strict';

var _ = require('lodash');

/** @constant {Array} Blacklisted keys */

var KEY_BL = ['this'];

module.exports = ScopeScrubber;

/**
 * ScopeScrubber, which accepts two (optional) options: _include & _exclude.
 * While _include is present, only the models specified will be sync'd.
 * Whitelisted (_exclude) options, should be used with caution.
 * @private
 * @param {Object} [opts]
 * @config {Array} [_include] - Model keys, to be sync'd
 * @config {Array} [_exclude] - Model keys, to be excluded from sync
 */
function ScopeScrubber(opts) {
  _.bindAll(this);

  opts = opts || {};

  // Seperate strings & RegExp for included keys
  this._include = _.reject(opts._include, _.isRegExp);
  this._includeRegExp = _.select(opts._include, _.isRegExp);

  // Seperate strings & RegExp for excluded keys
  this._exclude = _.reject(opts._exclude, _.isRegExp);
  this._excludeRegExp = _.select(opts._exclude, _.isRegExp);

  this.cleanKeys = [];
}

/**
 * Applies a filter to each model in scope
 * @private
 * @param {Object} $scope - rootScope
 * @returns {Array} cleanKeys - The keys associated with sync-eligible models
 */
ScopeScrubber.prototype.clean = function($scope) {
  // Run keys through the filter, reject false values, and merge with clean keys
  var keysFiltered = _.filter(_.map($scope, this._filter));
  this.cleanKeys = _.union(this.cleanKeys, keysFiltered);

  return _.clone(this.cleanKeys);
};

/**
 * Pushes valid keys into the cleanKeys array
 * @private
 * @param {*} value - The value of the model in $scope
 * @param {String} key - The key of the model in $scope
 * @todo Return true for valid keys
 */
ScopeScrubber.prototype._filter = function(value, key) {
  if (_.contains(this.cleanKeys, key)) {
    return false;
  }

  if (_.contains(KEY_BL, key)) {
    return false;
  }

  if (key.charAt(0) === '$') {
    return false;
  }

  var validValue = _.any([
    _.isPlainObject,
    _.isString,
    _.isBoolean,
    _.isArray,
    _.isNumber,
    _.isString
  ], function(validationFn) {
    return validationFn(value);
  });

  if (!validValue) {
    return false;
  }

  if (_.methods(value).length) {
    return false;
  }

  if (_.isPlainObject(value)) {
    var nestedMethods = _.any(_.values(value), _.methods);

    if (nestedMethods) {
      return false;
    }
  }

  if (!this._included(key)) {
    return false;
  }

  if (this._excluded(key)) {
    return false;
  }

  return key;
};

/**
 * Returns true if (a) the include option was not specified, (b) the key is
 * in the include option array, or (c) the key is matched by regex in the
 * include option array.
 * @private
 * @param {String} key - The key of the model in $scope
 */
ScopeScrubber.prototype._included = function(key) {
  if (_.isEmpty(this._include) && _.isEmpty(this._includeRegExp)) {
    return true;
  }

  var included = _.contains(this._include, key);

  if (included) {
    return true;
  }

  return _.any(this._includeRegExp, _.bind(String.prototype.match, key));
};

/**
 * Returns true if (a) the key is in the exclude option array, or (b) the key
 * is matched by regex in the exclude option array.
 * Returns false if the exclude option is not defined.
 * @private
 * @param {String} key - The key of the model in $scope
 */
ScopeScrubber.prototype._excluded = function(key) {
  if (_.isEmpty(this._exclude) && _.isEmpty(this._excludeRegExp)) {
    return false;
  }

  var excluded = _.contains(this._exclude, key);

  if (excluded) {
    return true;
  }

  return _.any(this._excludeRegExp, _.bind(String.prototype.match, key));
};
