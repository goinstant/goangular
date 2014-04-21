/*jshint node:true */

'use strict';

var hipchat = require('node-hipchat');
var async = require('async');
var _ = require('lodash');

var HIPCHAT_TOKEN = process.env.HIPCHAT_TOKEN;
var TAG = process.env.TRAVIS_BRANCH;
var ROOMS = process.env.ROOMS.split(/,\s?/);
var TEMPLATE = 'Update of <a href="http://github.com/<%- user %>/<%- repo %>/' +
               'releases/tag/<%- tag %>"><%- repo %>:<%- tag %><%- latest %>' +
               '</a> to <a href="<%- cdn %>/<%- repo %>/<%- tag %>/' +
               '<%- repo %>.js">Production</a> was successful!';

module.exports = HipchatNotify;

function HipchatNotify(opts) {
  this._HC = new hipchat(HIPCHAT_TOKEN);

  this._user = opts.user;
  this._repo = opts.repo;
  this._cdn = opts.cdn;
  this._tagData = opts.tagData;
  this._template = opts.template || TEMPLATE;
}

HipchatNotify.prototype.sendDeployMessage = function(cb) {
  var self = this;

  cb = _.isFunction(cb) ? cb : function() {};

  var vars = {
    user: self._user,
    repo: self._repo,
    cdn: self._cdn,
    tag: TAG,
    latest: self._tagData.isLatest ? '/latest' : null
  };

  var message = _.template(self._template, vars);

  var params = {
    from: 'Travis CI',
    message: message,
    color: 'purple'
  };

  async.each(ROOMS, function(room, done) {
    params.room = room;

    self._HC.postMessage(params, function(data) {
      var err = null;

      if (!data || data.status !== 'sent') {
        err = new Error('Hipchat message failed');
      }

      done(err);
    });
  }, cb);
};
