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

var keySyncFactory = require('./lib/key_sync_factory');
var keyFactory = require('./lib/key_factory');

var querySync = require('./lib/query_sync');
var queryFactory = require('./lib/query_factory');

var usersSyncFactory = require('./lib/users_sync_factory');
var usersFactory = require('./lib/users_factory');

/** Module Registration */

var goangular = angular.module('goangular', []);

/** Services **/

goangular.provider('$goConnection', connectionFactory);

goangular.factory('$goKeySync', [ '$parse', '$timeout', keySyncFactory ]);
goangular.factory('$goKey', [ '$goKeySync', '$goConnection', keyFactory ]);

goangular.factory('$goQuerySync', [ '$parse', '$timeout', querySync ]);
goangular.factory('$goQuery', [
  '$goQuerySync',
  '$goKey',
  '$goConnection',
  queryFactory
]);

goangular.factory('$goUsersSync', [ '$parse', '$timeout', usersSyncFactory ]);
goangular.factory('$goUsers', [
  '$goUsersSync',
  '$goKey',
  '$goConnection',
  '$q',
  usersFactory
]);
