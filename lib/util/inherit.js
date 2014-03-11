/* jshint browser:true */
/* global module, require */

/**
 * @fileOverview
 *
 * This file contains the inheritPrototype function, responsible for inheriting
 * a SuperClass into a SubClass.
 */

'use strict';

var _ = require('lodash');

module.exports = inheritPrototype;

/**
 * Creates a new object given the provided object's prototype
 * @param {Object} obj The object, whose's prototype will become the new
 *                     object's prototype
 */
var createObject = Object.create;

if (!_.isFunction(createObject)) {
  createObject = function(obj) {
    function F() {}

    F.prototype = obj;
    return new F();
  };
}

function inheritPrototype(SubClass, SuperClass) {
  var superCopy = createObject(SuperClass.prototype);
  superCopy.constructor = SubClass;

  SubClass.prototype = superCopy;
}

