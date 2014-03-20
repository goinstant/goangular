/* jshint browser:true */
/* global require, angular */
/* exported goinstant */

/**
 * @fileOverview
 *
 * Contains Angular service and filter registrations
 **/

'use strict';

var connectionFactory = require('./lib/connection_factory');

var channel = require('./lib/channel');

var keySync = require('./lib/key_sync');
var keyFactory = require('./lib/key_factory');

var querySync = require('./lib/query_sync');
var queryFactory = require('./lib/query_factory');

/** Module Registration */

var goangular = angular.module('goangular', []);

/** Services **/

goangular.provider('$goConnection', connectionFactory);

goangular.factory('$goChannel', ['$goConnection', channel.factory ]);

goangular.factory('$goKeySync', [ '$parse', '$timeout', keySync ]);
goangular.factory('$goKey', [ '$goKeySync', '$goConnection', keyFactory ]);

goangular.factory('$goQuerySync', [ '$parse', '$timeout', querySync ]);
goangular.factory('$goQuery', [
  '$goQuerySync',
  '$goKey',
  '$goConnection',
  queryFactory
]);
