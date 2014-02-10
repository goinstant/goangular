/*node browser: false */
/* globals exports, require */

'use strict';

/**
 * @requires
 */
var vars = require('../util/vars');

/**
 * @const
 */

var index = exports;
index.constructor = function() {};

index.load = function(req, res) {
  vars.generate(req.session, function(data) {

    res.render('index', data);
  });
};
