/* jshint browser: true */
/* global module */

'use strict';

/*  Expose `errors` */

var errors = module.exports = function errors() {};

var errorMap = {
  INVALID_CALLBACK: ': Callback was not found or invalid',
  INVALID_OPTIONS: ': Options was not found or invalid',
  INVALID_ARGUMENT: ': Invalid argument passed',
  INVALID_ROOM: ': Room was not found or invalid',
  INVALID_SCOPE: ': Scope was not found or invalid',
  INVALID_NAMESPACE: ': Namespace was not found or invalid',
  INVALID_URL: ': Connect url was not found or invalid',
  INVALID_TOKEN: ': User Token is not a valid string',
  INVALID_KEY: ': Key was not found or invalid',
  INVALID_INCLUDE: ': Include is not a valid array',
  INVALID_EXCLUDE: ': Include is not a valid array',
  MISSING_DEPENDENCY: ': goinstant must be loaded',
  INVALID_ID: ': ID must be a string'
};

errors.errorMap = errorMap;

errors.create = function(method, type) {
  if (!method || !type || !errorMap[type]) {
    throw new Error('That error type doesn\'t exist!');
  }

  return new Error(method + '' + errorMap[type]);
};
