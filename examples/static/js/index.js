/* node:false browser: true */
/* globals angular, _ */

(function() {

'use strict';

var module = angular.module('index');

module.factory('envConfig',
  ['envSelected', 'envs', function(envSelected, envs) {
    var envArray = [];

    _.each(envs, function(path, key) {
      envArray.push({
        value: key,
        path: path
      });
    });

    var data = {
      envs: envArray,
      selected: envSelected
    };

    return data;
  }
]);

module.factory('exConfig',
  ['exSelected', 'examples', function(exSelected, examples) {
    var data = {
      examples: examples,
      selected: exSelected
    };

    return data;
  }
]);

module.factory('environment', function($http) {
  var service = {
    set: function(env) {
      var params = {
        env: env
      };

      $http.post('/setEnvironment', params).success(function() {
        window.location.reload();
      });
    }
  };

  return service;
});

module.factory('example', function() {
  var service = {
    load: function(name) {
      window.location = '/examples/' + name;
    }
  };

  return service;
});

module.controller('envSelectorCtrl', function($scope, environment, envConfig) {
  $scope.envs = envConfig.envs;

  _.each($scope.envs, function(env) {
    if (env.value === envConfig.selected) {
      $scope.selected = env;

      return false;
    }
  });

  $scope.setEnv = function() {
    environment.set($scope.selected);
  };
});

module.controller('exSelectorCtrl', function($scope, example, exConfig) {
  $scope.examples = exConfig.examples;

  $scope.selected = exConfig.selected;

  $scope.loadExample = function() {
    example.load($scope.selected);
  };
});

})();
