/* jshint browser:true */
/* global module */

/**
 * @fileOverview
 *
 * This file contains the inherit function, used to inherit a class without any
 * constructor side-effects.
 */

'use strict';

module.exports = inherit;

/**
 * Creates a dummy constructor and inherits from superClass.
 *
 * @param {object} superClass The superClass prototype to inherit.
 * @returns {object} The superClass with a dummy constructor.
 */
function inherit(superClass) {
  function Super() {}
  Super.prototype = superClass;

  return new Super();
}
