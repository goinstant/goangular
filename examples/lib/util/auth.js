/* node browser: false */
/* globals exports, require */

'use strict';

/**
 * @requires
 */
var crypto = require('crypto');
var Signer = require('goinstant-auth').Signer;
var config = require('../../../config/config.js');

var auth = exports;
auth.constructor = function() {};

auth.generateJWT = function(platformEnv, cb) {
  var signer = new Signer(config.platform[platformEnv].appSecret);

  crypto.randomBytes(20, function(err, buffer) {
    var rand = buffer.toString('hex');

    var claims = {
      domain: config.iss || 'goangularExamples',
      id: platformEnv + '-goangular-' + rand,
      displayName: 'goangular-dev'
    };

    signer.sign(claims, cb);
  });
};
