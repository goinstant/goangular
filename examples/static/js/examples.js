/* node:false browser: true */
/* globals angular, _, console */

(function() {

'use strict';

var module = angular.module('Examples');

module.config(
  ['$routeProvider', 'examples', function($routeProvider, examples) {
    $routeProvider.when('/index', {
      templateUrl: '../templates/index.html',
      controller: 'IndexCtrl'
    }).otherwise({
      redirectTo: '/index'
    });

    _.each(examples, function(ex) {
      console.log(ex);
      $routeProvider.when('/' + ex.name, {
        templateUrl: '../examples/' + ex.name + '/index.html',
        controller: ''
      });
    });
}]);

module.controller('IndexCtrl', function() {
  console.log('Index Ctrl');
});

})();
