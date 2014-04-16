/* jshint node: true */

'use strict';

var GitHubApi = require("github");
var _ = require('lodash');

var TRAVIS_COMMIT = process.env.TRAVIS_COMMIT;
var TRAVIS_BRANCH = process.env.TRAVIS_BRANCH;

module.exports = TagChecker;

function TagChecker(user, repo) {
  var opts = {
    version: '3.0.0',
    timeout: 5000
  };

  this._github = new GitHubApi(opts);

  this._user = user;
  this._repo = repo;
}

TagChecker.prototype.check = function(cb) {
  var opts = {
    user: this._user,
    repo: this._repo
  };

  this._github.repos.getTags(opts, function(err, tags) {
    if (err) {
      return cb(err);
    }

    var tag = tags[0];

    var result = {
      isTag: isTag(tags),
      isLatest: TRAVIS_BRANCH === tag.name
    };

    cb(null, result);
  });
};

function isTag(tags) {
  var result = false;

  _.each(tags, function(tag) {
    var sha = tag.commit.sha;

    if (sha === TRAVIS_COMMIT && tag.name === TRAVIS_BRANCH) {
      result = true;

      return false;
    }
  });

  return result;
}
