/* jshint browser: true */
/* global require, angular, CONFIG */

/**
 * @fileOverview
 *
 * This file contains an example, only designed for use during development
 */

'use strict';

/** Module Dependencies */


// Create an AngularJS application module
var app = angular.module('app', ['goangular']);

app.config(function($goConnectionProvider) {
  $goConnectionProvider.$set(CONFIG.connectUrl);
});

app.controller('sweetController', function($scope, $goKey, $goConnection) {

  $scope.todos = $goKey('todos').$sync();

  $goConnection.$ready().then(function(connection) {
    var room = connection.room('lobby');
    room.self().get().then(function(results) {
      $scope.currentUser = results.value;
      $scope.$apply();
    });
  });

  $scope.addTodo = function() {
    var desc = $scope.newTodo;
    if (desc === undefined || desc === '') {
      return;
    }

    $scope.todos.$add({
      timestamp: new Date().getTime(),
      description: $scope.newTodo,
      complete: false
    }).then(function() {
      $scope.newTodo = '';
      $scope.$apply();
    });
  };

  var opts = {
    local: true
  };

  $scope.todos.$on('add', opts, function(value) {
    $scope.description = value.description;
  });

  $scope.remove = function(key) {
    console.log('key remove is called on', key);
    $scope.todos.$key(key).$remove();
  };
});

app.directive('enter', function() {
  var dir = {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('keydown', function(event) {
        var key = (event.which) ? event.which : event.keyCode;

        if (key !== 13) {
          return;
        }

        scope.$eval(attrs.enter);
      });
    }
  };

  return dir;
});
