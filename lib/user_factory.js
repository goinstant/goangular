/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the UserFactory, responsible for creating and retrieving
 * user objects.
 */

'use strict';

var errors = require('./errors');
var _ = require('lodash');

module.exports = UserFactory;

UserFactory.debug = {
  User: require('./user_model')
};

var EXPORTED_METHODS =  ['getUser', 'getSelf', 'getUsers'];

/**
 * UserFactory provides a set of methods of finding and managing GoInstant users
 * @private
 * @constructor
 * @class
 * @param {Object} $q - Angular promise library
 * @param {Object} $rootScope - use to emit & broadcast events
 * @param {Object} cache - Instance of user cache
 * @returns {Object} userFactory
 */
function UserFactory($q, $rootScope, cache, room) {
  _.extend(this, {
    _$q: $q,
    _$rootScope: $rootScope,
    _cache: cache,
    _room: room,
    _users: {},
    EXPORTED_METHODS: EXPORTED_METHODS
  });
}

/**
 * Returns a user object
 * @param {Object} id - GoInstant user id
 * @returns {Object} user
 */
UserFactory.prototype.getUser = function(id) {
  if (!_.isString(id)) {
    throw errors.create('goUsers', 'INVALID_ID');
  }

  if (this._users[id]) {
    return this._users[id];
  }

  var props = this._cache.getUser(id);
  var key = this._cache.getUserKey(id);

  this._users[id] = new UserFactory.debug.User(
    props,
    key,
    this._cache,
    this._$q,
    this._$rootScope
  );

  return this._users[id];
};

/**
 * Get the local user
 * @returns {Object} user
 */
UserFactory.prototype.getSelf = function() {
  var id = this._cache.getLocalUser().id;

  return this.getUser(id);
};

/**
 * Get all users
 * @returns {Array} users
 */
UserFactory.prototype.getUsers = function() {
  var self = this;

  return _.map(self._cache.getAllUserKeys(), function(key) {
    return self.getUser(_.last(key.name.split('/')));
  });
};
