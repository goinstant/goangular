/* node browser: false */
/* globals exports, require, console, __dirname */

'use strict';

/**
 * @requires
 */
var file = require('file');
var path = require('path');
var auth = require('./auth');
var config = require('../../../config/config');
var _ = require('lodash');

var vars = exports;
vars.constructor = function() {};

vars.generate = function(session, cb) {
  var data = {
    platform: config.platform,
    connectUrl: config.connectUrl,
    env: session.env || config.defaultEnv,
    envs: config.envs,
    ex: null,
    examples: this.getExamplesList()
  };

  data.goangular = config.envs[data.env] || config.envs[data.env];

  if (session.token) {
    data.token = session.token;

    return cb(data);
  }

  auth.generateJWT(function(err, token) {
    if (err) {
      console.log(err);

      return cb(null);
    }

    data.token = token;
    session.token = token;

    return cb(data);
  });
};

vars.getExamplesList = function() {
  var examples = [];

  this.walkExamples(function(relPath, dirs, files) {
    _.each(files, function(fileName) {
      if (_.contains(fileName, '.example')) {
        return;
      }

      examples.push(fileName.replace('.ejs', ''));
    });
  });

  return examples;
};

vars.walkExamples = function(cb) {
  var start = path.join(__dirname, '../../views/examples');

  file.walkSync(start, function(dirPath, dirs, files) {
    cb(file.path.relativePath(start, dirPath), dirs, files);
  });
};
