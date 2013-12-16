/* jshint browser:true */
/* global require, angular */
/* exported goinstant */

/**
 * @fileOverview
 *
 * Responsible for creating the goinstant AngularJS module and registering
 * the goConnect provider and goAngular scope synchronization service.
 *
 * @example
 *   var app = angular.module('app', ['goinstant']);
 *
 *   app.config(function(goConnectProvider) {
 *    goConnectProvider.set('https://goinstant.goinstant.net/YOURAPP/YOURROOM');
 *   });
 *
 *   app.controller('ctrlName',
 *     ['$scope', 'goAngular', function($scope, goAngular) {
 *
 *     var goAngular = new goAngular($scope,'uniqueNamespace');
 *
 *     goAngular.initialize();
 *   }]);
 */

'use strict';

var connectionFactory = require('./lib/connection_factory');
var goAngularFactory = require('./lib/go_angular_factory');
var syncFactory = require('./lib/sync_factory');

/** Create AngularJS goangular module */

var goangular = angular.module('goangular', []);

/** Register connection Service */

goangular.provider('goConnection', connectionFactory);

goangular.factory('goSync', ['$parse', syncFactory]);

/** Register GoAngular Factory */

goangular.factory('goSyncScope', [
  '$q',
  '$parse',
  'goConnection',
  goAngularFactory
]);
