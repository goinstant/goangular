/*node browser: false */
/* globals exports, require */

'use strict';

/**
 * @requires
 */
var vars = require('../util/vars');

var example = exports;
example.constructor = function() {};

example.load = function(req, res) {
  vars.generate(req.session, function(data) {

    var example = req.params.name || null;

    data.ex = example;
    data.title = 'GoAngular Examples - ' + example;
    res.render('examples/' + example, data, function(err, html) {
      if (err) {
        res.redirect('/examples');
      }

      res.end(html);
    });
  });
};

example.setEnv = function(req, res) {
  var env = req.body.env.value;

  req.session.env = env;

  res.redirect('/examples');
};
