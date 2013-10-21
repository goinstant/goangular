/* jshint browser: true */
/* global require, console, angular, CONFIG */

/**
 * @fileOverview
 *
 * This file contains an example, primarily designed for use during development
 */

'use strict';

/** Module Dependencies */

require('goangular');

// Create an AngularJS application module
var ourCoolApp = angular.module('ourCoolApp', ['goinstant']);

ourCoolApp.config(function(platformProvider) {
  platformProvider.set(CONFIG.connectUrl);
});

ourCoolApp.controller('sweetController', function($scope, GoAngular) {
  var goAngular = new GoAngular($scope, 'sweetController');

  $scope.newTodo = '';
  $scope.todos = [];

  goAngular
    .initialize()
    .then(function() {
      console.log('Success: scope is being synchronized');
    }, function(err) {
      console.error('Error', err);
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
