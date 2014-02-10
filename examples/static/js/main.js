/* node:false browser: true */
/* globals angular */

(function() {

'use strict';

angular.module('config', []);
angular.module('index', ['config']);
angular.module('example', ['goangular', 'config']);

angular.module('GoAngularExamples', [
  'index',
  'example'
]);

})();
