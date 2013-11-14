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

ourCoolApp.controller('sweetController', function($scope, GoAngular, goUsers) {

$scope.currentUser = {};
$scope.currentUser.displayName = 'Bob';

goUsers
  .room('lobby')
  .initialize()
  .then(function(lobbyUsers) {
    console.log(lobbyUsers);

    var localUser = lobbyUsers.getSelf();

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

    angular.forEach(lobbyUsers.getUsers(), function(user) {
      console.log(user);
    });

    $scope.$on('go:join', function(event, user) {
      console.log(user);
    });

    $scope.$on('go:leave', function(event, user) {
      console.log(user);
    });
  });

  // var goAngular = new GoAngular($scope, 'sweetController');

  $scope.newTodo = '';
  $scope.todos = [];

  // goAngular
  //   .initialize()
  //   .then(function() {
  //     console.log('Success: scope is being synchronized');
  //   }, function(err) {
  //     console.error('Error', err);
  //   });

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
