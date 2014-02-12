/* jshint browser: true */
/* global angular */

/**
 * @fileOverview
 *
 * This file contains an example, only designed for use during development
 */

'use strict';

// Create an AngularJS application module
var example = angular.module('example');

example.config(['connectUrl', '$goConnectionProvider',
  function(connectUrl, $goConnectionProvider) {
    $goConnectionProvider.$set(connectUrl);
}]);

example.controller('sweetController', function($scope, $goKey, $goConnection) {

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

example.directive('enter', function() {
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
