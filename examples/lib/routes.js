/* node browser: false */
/* globals exports, require */

'use strict';

/**
 * @requires
 */
var index = require('./controllers/index');
var example = require('./controllers/example');

var routes = exports;
routes.constructor = function() {};

routes.load = function(app) {
  app.get('/', index.load);

  app.get('/index', index.load);

  app.get('/examples', index.load);

  app.get('/examples/:name', example.load);

  app.post('/setGoangular', example.setGoangular);

  app.post('/setPlatform', example.setPlatform);
};
