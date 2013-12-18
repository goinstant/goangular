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
var ourCoolApp = angular.module('ourCoolApp', ['goangular']);

ourCoolApp.config(function(goConnectionProvider) {
  goConnectionProvider.set(CONFIG.connectUrl);
});

ourCoolApp.controller('sweetController',
  function($scope, GoAngular, goConnection) {

    goConnection.ready().then(function(connection) {
      return connection.room('aRoom').join().get('room');
    }).then(function(aRoom) {
      console.log('a room:', aRoom);
    });

    $scope.currentUser = {};
    $scope.currentUser.displayName = 'Bob';
    $scope.newTodo = '';
    $scope.todos = [];

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
