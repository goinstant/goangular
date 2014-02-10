/* node browser: false */
/* globals require, __dirname, process, console */

'use strict';

var express = require('express');
var routes = require('./lib/routes');
var http = require('http');
var path = require('path');
var ejsLocals = require('ejs-locals');
var config = require('../config/config.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsLocals);
app.locals({
  _layoutFile: 'layout',
  title: 'GoAngular Examples'
});
app.use(express.favicon(path.join(__dirname, 'static/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.cookieSession({
  secret: config.sessionsSecret
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, '../build')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes.load(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
