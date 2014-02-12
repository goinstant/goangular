/* jshint browser: true */
/* global angular */

/**
 * @fileOverview
 *
 * This file contains an example, only designed for use during development
 */

'use strict';

var example = angular.module('example');

example.config(['connectUrl', '$goConnectionProvider',
  function(connectUrl, $goConnectionProvider) {
    var options = {
      user: {
        displayName: 'Goangular Tester'
      },
      room: 'goangularTestRoom'
    };

    $goConnectionProvider.$set(connectUrl, options);
  }
]);

example.controller('exampleCtrl', ['$scope', '$goConnection', '$goKey',
  function($scope, $goConnection, $goKey) {
    $scope.message = 'Disconnected.';
    $scope.connected = 'offline';

    $goConnection.$ready().then(function(connection) {
      $scope.connected = 'online';
      $scope.message = 'Connected. Account: ' + connection._account +
        ' | App: ' + connection._application;

      // Get the users list when we join
      $scope.users = $goKey('.users').$sync();
      $scope.users.$on('ready', function() {
        $scope.room = 'Room: ' + connection._joinedRooms[0].name;

        $scope.$apply();
      });

    }).catch(function(err) {
      $scope.message = err.message;

      $scope.$apply();
    });
  }
]);
