/* jshint browser:true */
/* global require, angular */
/* exported goinstant */

/**
 * @fileOverview
 *
 * Responsible for creating the goinstant AngularJS module and registering
 * the platform provider and goAngular scope synchronization service.
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

var goConnect = require('./lib/go_connect');
var goUsersFactory = require('./lib/go_users_factory.js');
var goAngularFactory = require('./lib/go_angular_factory');

/** Create AngularJS goinstant module */

var goinstant = angular.module('goinstant', []);

/**
 *  Register goConnect Service
 *
 *  platformProvider is being aliased for backwards compatibility
 *  consider it deprecated
 */

goinstant.provider('goConnect', goConnect);
goinstant.provider('platform', goConnect);

/** Register goUsers Factory */

goinstant.factory('goUsers', goUsersFactory);

/** Register GoAngular Factory */

goinstant.factory('GoAngular', ['$q', '$parse', 'goConnect', goAngularFactory]);
