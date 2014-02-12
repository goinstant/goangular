/* jshint browser: true */
/* global angular */

/**
 * @fileOverview
 *
 * This file contains an example, only designed for use during development
 */

'use strict';

var example = angular.module('example');

example.controller('exampleCtrl', ['$scope', 'connectUrl', '$goConnection',
  function($scope, connectUrl, $goConnection) {
    $scope.message = 'Disconnected.';
    $scope.connected = 'offline';

    $goConnection.$connect(connectUrl).then(function(connection) {
      $scope.connected = 'online';
      $scope.message = 'Connected. Account: ' + connection._account +
        ' | App: ' + connection._application;
      $scope.$apply();

    }).catch(function(err) {
      $scope.message = err.message;

      $scope.$apply();
    });
  }
]);
