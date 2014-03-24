/* jshint browser:true */
/* global module, require */

/**
 * @fileOverview
 *
 * This file contains the inheritPrototype function, responsible for inheriting
 * a SuperClass's prototype into a SubClass.
 */

'use strict';

var _ = require('lodash');

module.exports = inheritPrototype;

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

