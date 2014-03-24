/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the key filter, used to convert a collection of models
 * into an array of models.
 */

'use strict';

var _ = require('lodash');

/**
 * Converts the model from an object to an array. Orders the result of a goQuery
 * given the $$index on the model.
 * @public
 * @returns {function} The goangular filter function
 */
module.exports = function keyFilter() {
  var mPrimToObj = memoize(primToObj);

  return function(model, enabled) {
    enabled = (_.isBoolean(enabled)) ? enabled : true; // Default: true

    if (!model || !_.isObject(model) || _.isArray(model) || !enabled) {
      return model;
    }

    var output = [];
    var data = null;

    if (!_.has(model, '$$index')) {
      data = _.keys(model);

    } else if (_.has(model, '$omit') && model.$$index.length === 0) {
      data = _.keys(model.$omit());

    } else {
      data = model.$$index;
    }

    _.each(data, function(key) {
      var value = model[key];

      if (!_.isObject(value)) {
        value = mPrimToObj(key, value);

      } else {
        value.$name = key;
      }

      output.push(value);
    });

    return output;
  };
};

/**
 * Creates a new model for primitives to hold the key $name and $value.
 * @private
 * @returns {object} Model for primitives
 */
function primToObj(name, value) {
  return {
    $value: value,
    $name: name
  };
}

/**
 * Memoizes a function and uses both the key name and value to cache results.
 * @private
 * @returns {function} A memoize-wrapped function.
 */
function memoize(func) {
  var memoized = function() {
    var cache = memoized.cache;

    var name = arguments[0];
    var value = arguments[1];

    cache[name] = cache[name] || {};

    if (!_.isUndefined(cache[name][value])) {
      return cache[name][value];
    }

    cache[name][value] = func.call(null, name, value);

    return cache[name][value];
  };

  memoized.cache = {};

  return memoized;
}
