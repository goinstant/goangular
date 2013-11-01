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
 *   app.config(function(platformProvider) {
 *    platformProvider.set('https://goinstant.goinstant.net/YOURAPP/YOURROOM');
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
var goAngularFactory = require('./lib/go_angular_factory');

/** Create AngularJS goinstant module */

var goinstant = angular.module('goinstant', []);

/** Register Platform Service */

goinstant.provider('goConnect', goConnect);

/** Register GoAngular Service */

goinstant.factory('GoAngular', ['$q', '$parse', 'goConnect', goAngularFactory]);
