/* jshint browser: true */
/* global require, angular, CONFIG, console */

/**
 * @fileOverview
 *
 * This file contains an example, only designed for use during development
 */

'use strict';

// Create an AngularJS application module
var app = angular.module('app', ['goangular']);

app.config(function($goConnectionProvider) {
  $goConnectionProvider.$set(CONFIG.connectUrl);
  $goConnectionProvider.$loginUrl(null);
  $goConnectionProvider.$loginUrl(['GitHub', 'Twitter', 'Salesforce']);
  $goConnectionProvider.$logoutUrl();
});

app.controller('sweetController', function($scope, $goQuery, $goUsers, $goConnection) {
  window.scope = $scope; // expose scope for debugging

  // $goConnection
  $scope.conn = $goConnection;

  console.log($scope.conn.isGuest, 'isGuest'); // null
  $scope.conn.$ready().then(function() {
    console.log($scope.conn.isGuest, 'isGuest'); // boolean
  });

  // $goKey
  $scope.todos = $goQuery('todos', { sort: { '$name': 'desc'}}).$sync();

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

  $scope.todos.$on('add', opts, function(value, context) {
    $scope.last = {
      description: value.description,
      user: $scope.users[context.userId].displayName
    };
  });

  $scope.remove = function(key) {
    console.log('key remove is called on', key);
    $scope.todos.$key(key).$remove();
  };

  // $goUsers
  $scope.users = $goUsers().$sync();

  $scope.users.$self(false).then(function(model) {
    $scope.local = model.$sync();
  });

  $scope.users.$on('join', function(user) {
    console.log('user joined', user.id, user.displayName);
  });

  $scope.users.$on('leave', function(user) {
    console.log('user left', user.id, user.displayName);
  });
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
