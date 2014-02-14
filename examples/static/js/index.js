/* node:false browser: true */
/* globals angular, _, window */

(function() {

'use strict';

var module = angular.module('index');

module.factory('platformConfig',
  ['platformEnvs', 'platformEnv', function(envs, env) {
    var envArray = [];

    _.each(envs, function(path, key) {
      envArray.push({
        value: key,
        path: path
      });
    });

    var data = {
      envs: envArray,
      selected: env
    };

    return data;
  }
]);

module.factory('goangularConfig',
  ['goangularEnvs', 'goangularEnv', function(envs, env) {
    var envArray = [];

    _.each(envs, function(path, key) {
      envArray.push({
        value: key,
        path: path
      });
    });

    var data = {
      envs: envArray,
      selected: env
    };

    return data;
  }
]);

module.factory('exampleConfig',
  ['examples', 'example', function(exs, ex) {
    var data = {
      examples: exs,
      selected: ex
    };

    return data;
  }
]);

module.factory('platformEnvConfig', function($http) {
  var service = {
    set: function(env) {
      var params = {
        env: env
      };

      $http.post('/setPlatform', params).success(function() {
        window.location.reload();
      });
    }
  };

  return service;
});

module.factory('goangularEnvConfig', function($http) {
  var service = {
    set: function(env) {
      var params = {
        env: env
      };

      $http.post('/setGoangular', params).success(function() {
        window.location.reload();
      });
    }
  };

  return service;
});

module.factory('exampleRoute', function() {
  var service = {
    load: function(name) {
      window.location = '/examples/' + name;
    }
  };

  return service;
});

module.controller('platformEnvCtrl',
  function($scope, platformEnvConfig, platformConfig) {
    $scope.envs = platformConfig.envs;

    _.each($scope.envs, function(env) {
      if (env.value === platformConfig.selected) {
        $scope.selected = env;

        return false;
      }
    });

    $scope.setPlatform = function() {
      platformEnvConfig.set($scope.selected);
    };
  }
);

module.controller('goangularEnvCtrl',
  function($scope, goangularEnvConfig, goangularConfig) {
    $scope.envs = goangularConfig.envs;

    _.each($scope.envs, function(env) {
      if (env.value === goangularConfig.selected) {
        $scope.selected = env;

        return false;
      }
    });

    $scope.setGoangular = function() {
      goangularEnvConfig.set($scope.selected);
    };
  }
);

module.controller('exSelectorCtrl',
  function($scope, exampleRoute, exampleConfig) {
    $scope.examples = exampleConfig.examples;

    $scope.selected = exampleConfig.selected;

    $scope.loadExample = function() {
      exampleRoute.load($scope.selected);
    };
  }
);

})();
