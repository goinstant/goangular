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
  $goConnectionProvider.$set(CONFIG.connectUrl);
});


ourCoolApp.controller('sweetController', function($scope, $goKey, $goQuery, $goConnection) {

  //$scope.todos = $goQuery('todos', {}, { sort: { 'timestamp': 'desc' }, limit: 50 }).$sync();
  $scope.todos = $goKey('todos').$sync();

  console.log('todos', $scope.todos);

  // //$scope.todos.$sync();

  // console.log('todos', $scope.todos);

  // // // reference nested key via todos
  // $scope.name = $scope.todos.$key('9edd3cf39e22da900707d9091f90eb52').$key('description').$sync();

  // // // reference nested key via .key
  // $scope.description = $goKey('todos/9edd3cf39e22da900707d9091f90eb52').$sync();

  setTimeout(function() {
    $scope.todos.$key('9edd3cf39e22da900707d9091f90eb52').$set({
      timestamp: new Date().getTime(),
      description: 'an Item'
    });
  }, 1000);

  $scope.addTodo = function() {
    $scope.todos.$add({
      timestamp: new Date().getTime(),
      description: $scope.newTodo,
      complete: false
    }).then(function() {
      console.log(arguments);
    });
  };

  $scope.remove = function(key) {
    console.log('key remove is called on', key);
    $scope.todos.$key(key).$remove();
  };

});

function whatever(key, room, filter, options) {
  console.log(arguments)

  var a = new Args([
    { key: Args.OBJECT | Args.STRING | Args.Required },
    { room: Args.STRING | Args.Optional },
    { filter: Args.OBJECT | Args.Optional, _default: {} },
    { options: Args.OBJECT | Args.Required }
  ], arguments);
}
