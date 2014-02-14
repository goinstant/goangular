/* jshint browser: true */
/* global angular, _ */

/**
 * @fileOverview
 *
 * This file contains an example, only designed for use during development
 */

'use strict';

var example = angular.module('example');

example.config(['connectUrl', 'token', '$goConnectionProvider',
  function(connectUrl, token, $goConnectionProvider) {
    var options = {
      user: token,
      room: 'chat-room'
    };

    $goConnectionProvider.$set(connectUrl, options);
  }
]);

example.controller('exampleCtrl', ['$scope', '$goKey',
  function($scope, $goKey) {
    $scope.todos = $goKey('todos').$sync();
    $scope.textInput = null;

    $scope.addTodo = function() {
      var msg = {
        text: $scope.textInput,
        edited: false,
        completed: false
      };

      $scope.todos.$add(msg).then(function() {
        $scope.textInput = null;
      });
    };

    $scope.removeTodo = function(id) {
      $scope.todos.$key(id).$remove();
    };

    $scope.editTodo = function(id, todo) {
      var msgKey = $scope.todos.$key(id);
      msgKey.$key('text').$set(todo);
      msgKey.$key('edited').$set(true);
    };

    var opts = {
      local: true,
      bubble: true
    };

    $scope.clearCompleted = function() {
      _.each($scope.todos.$omit(), function(todo, id) {
        if (!todo.completed) {
          return;
        }

        $scope.todos.$key(id).$remove();
      });
    };

    $scope.setCompleted = function(id, val) {
      $scope.todos.$key(id).$key('completed').$set(val);
    };

    $scope.setListener = function() {
      // $scope.state = $on/$off
      $scope.todos[$scope.state]('set', opts, listener);
    };

    function listener(value, context) {
      var path = context.key.split('/');
      if (path.pop() !== 'text') {
        return;
      }

      $scope.change = {
        msgId: path.pop(),
        text: value
      };
    }

    $scope.state = '$on';
    $scope.setListener();
  }
]);

example.directive('submit', function() {
  var dir = {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('keydown', function(event) {
        if (event.which !== 13) {
          return;
        }

        scope.$eval(attrs.submit);
      });
    }
  };

  return dir;
});
