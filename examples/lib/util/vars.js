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
    platformEnv: session.platformEnv || config.defaultPlatform,
    goangularEnv: session.goangularEnv || config.defaultGoangular,
    platformEnvs: config.platform,
    goangularEnvs: config.goangular,
    example: null,
    examples: this.getExamplesList()
  };

  data.platformCdn = config.platform[data.platformEnv].cdn;
  data.goangularCdn = config.goangular[data.goangularEnv];

  if (session.token && session.tokenEnv === data.platformEnv) {
    data.token = session.token;

    return cb(data);
  }

  auth.generateJWT(data.platformEnv, function(err, token) {
    if (err) {
      console.log(err);

      return cb(null);
    }

    data.token = token;

    session.tokenEnv = data.platformEnv;
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
