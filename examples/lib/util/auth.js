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

auth.generateJWT = function(cb) {
  var signer = new Signer(config.appSecret);

  crypto.randomBytes(20, function(err, buffer) {
    var rand = buffer.toString('hex');

    var claims = {
      domain: config.iss || 'localhost',
      id: 'goangular-' + rand,
      displayName: 'goangular-local-tester'
    };

    signer.sign(claims, cb);
  });
};
