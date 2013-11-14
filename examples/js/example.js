/* jshint browser: true */
/* global require, console, angular, CONFIG */

/**
 * @fileOverview
 *
 * This file contains an example, only designed for use during development
 */

'use strict';

/** Module Dependencies */

require('goangular');

// Create an AngularJS application module
var ourCoolApp = angular.module('ourCoolApp', ['goinstant']);

ourCoolApp.config(function(goConnectProvider) {
  goConnectProvider.set(CONFIG.connectUrl);
});

ourCoolApp.controller('sweetController',
  function($scope, GoAngular, goUsers, goConnect) {
    $scope.currentUser = {};
    $scope.currentUser.displayName = 'Bob';
    $scope.newTodo = '';
    $scope.todos = [];

    goConnect.then(function(goinstant) {
      console.log(goinstant);

      goinstant.connection.room('customRoom').join(function(err, customRoom) {
        console.log('customRoom', customRoom);

        var goAngular = new GoAngular($scope, 'sweetController', {
          room: customRoom,
          include: ['todos']
        });

        goAngular
          .initialize()
          .then(function() {
            console.log('Success: scope is being synchronized');
          }, function(err) {
            console.error('Error', err);
          });
      });
    });

    goUsers
      .room('lobby')
      .initialize()
      .then(function(lobbyUsers) {
        var localUser = lobbyUsers.self();

        console.log(localUser);

        $scope.currentUser.displayName = localUser.get('displayName');

        $scope.$watch('currentUser.displayName', function(newVal, oldVal) {
          if (newVal === oldVal) {
            return;
          }

          localUser.set('displayName', newVal);
        });

        localUser.on('change', function() {
          $scope.$apply(function() {
            $scope.currentUser.displayName = localUser.get('displayName');
          });
        });

        localUser.set('displayName', 'frank')
          .then(function() {
            console.log('name', localUser.get('displayName'));
          });

        angular.forEach(lobbyUsers.users(), function(user) {
          console.log(user);
        });

        lobbyUsers.on('join', function(user) {
          console.log(user);
        });

        lobbyUsers.on('leave', function(user) {
          console.log(user);
        });
      });

      $scope.addTodo = function() {
        if ($scope.newTodo !== '') {
          $scope.todos.push($scope.newTodo);
          $scope.newTodo = '';
        }
      };

      $scope.removeTodo = function(index) {
        $scope.todos.splice(index, 1);
      };
});
