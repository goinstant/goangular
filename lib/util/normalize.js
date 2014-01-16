/* jshint browser:true */
/* global module */

/**
 * @fileOverview
 *
 * This file contains the normalize function, responsible for preparing a remote
 * object to be merged into it's local counterpart
 */

'use strict';

/**
 * Normalizes the data returned from a event handler to get around the bug that
 * the handler does not set the full mutated object it just returns the
 * immediate value.
 *
 * Therefore, rebuild the object so it can cleanly be merged!
 *
 * @param {*} value the value returned to the handler
 * @param {Object} context the context returned to the handler
 */
module.exports = function normalize(value, context) {

  if (!context.currentKey) {
    throw new Error('An invalid context was provided during normalization.');
  }

  // Build up the value until the key and the curPath are the same, then we've
  // normalized the data properly.
  var segment;
  var newValue;
  var i;

  // Get the originating key path
  var curPath = (context.addedKey) ? context.addedKey : context.key;

  while (curPath !== context.currentKey) {

    // Get the trailing path segment
    i = curPath.lastIndexOf('/');
    segment = curPath.slice(curPath.lastIndexOf('/'));
    segment = segment.replace('/','');

    newValue = {};
    newValue[segment] = value;
    value = newValue;

    curPath = curPath.slice(0, i);
  }

  return value;
};
