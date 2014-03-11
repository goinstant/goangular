/* jshint browser: true */
/* global require, angular, CONFIG */

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
});

app.controller('sweetController', function($scope, $goKey, $goUsers, $goConnection) {
  $scope.connection = $goConnection;
  window.conn = $scope.connection;
  $scope.connection.$loginUrl(['GitHub', 'Twitter']);
  $scope.connection.$logoutUrl();

  console.log($scope.connection.isGuest);
  $scope.connection.$ready().then(function() {
    console.log($scope.connection.isGuest);
  });

  $scope.users = $goUsers();
  window.users = $scope.users;

  /*
  $scope.users.$self(true).then(function(m) {
    console.log(m);
  });
  */

 /*
  $scope.users.$self(false).then(function(m) {
    m.$key('displayName').$set('123');
    $scope.self = m;
    $scope.self.$sync();
  });
  */

  //$scope.self = $goUsers().$self();

  $scope.todos = $goKey('todos').$sync();
  window.todos = $scope.todos;

  /*
  $scope.users.$self().then(function(model) {
    $scope.localUser = model.$sync();
    window.localUser = $scope.localUser;
  });
  */

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

  $scope.users.$on('join', function(user) {
    console.log('user joined', user);
  });

  $scope.users.$on('leave', function(user) {
    console.log('user left', user);
  });

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
