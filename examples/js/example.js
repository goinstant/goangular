/* jshint browser: true */
/* global require, angular, CONFIG */

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

ourCoolApp.config(function($goConnectionProvider) {
  $goConnectionProvider.$set(CONFIG.connectUrl, { user: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dvaW5zdGFudC5uZXQvbWF0dGNyZWFnZXIvRGluZ0RvbmciLCJzdWIiOiJuYSIsImRuIjoiZHVkZSIsImciOltdLCJhdWQiOiJnb2luc3RhbnQubmV0In0.LcvRSDmEj9LHonPhnXv1OWTQ5gjcBnk1QgxH4iYt6PM'});
});

ourCoolApp.controller('sweetController', function($scope, $goKey) {

  $scope.todos = $goKey('todos');
  $scope.todos.$sync();

  console.log('todos', $scope.todos);

  // // reference nested key via todos
  $scope.name = $scope.todos.$key('9edd3cf39e22da900707d9091f90eb52').$key('description').$sync();

  // // reference nested key via .key
  $scope.description = $goKey('todos/9edd3cf39e22da900707d9091f90eb52').$sync();

  setTimeout(function() {
    $scope.todos.$key('9edd3cf39e22da900707d9091f90eb52/description').$set('jygjygjguj');
  }, 1000);

  $scope.addTodo = function() {
    $scope.todos.$add({
      timestamp: new Date().getTime(),
      description: $scope.newTodo,
      complete: false
    }, { expire: 500 }).then(function() {
      console.log(arguments);
    });
  };

  $scope.remove = function(key) {
    $scope.todos.$key(key).$remove();
  };

});
