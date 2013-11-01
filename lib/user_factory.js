/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * PUT STUFF HERE
 */

'use strict';

var User = require('./user_model');
var errors = require('./errors');
var _ = require('lodash');

module.exports = UserFactory;

var EXPORTED_METHODS =  ['getUser', 'getSelf', 'getUsers'];

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

UserFactory.prototype.getUser = function(id) {
  if (!_.isString(id)) {
    throw errors.create('goUsers', 'INVALID_ID');
  }

  if (this._users[id]) {
    return this._users[id];
  }

  var props = this._cache.getUser(id);
  var key = this._cache.getUserKey(id);

  this._users[id] = new User(props, key, this._cache, this._$q, this._$rootScope);

  return this._users[props.id];
};

UserFactory.prototype.getSelf = function() {
  var id = this._cache.getLocalUser().id;

  return this.getUser(id);
};

UserFactory.prototype.getUsers = function() {
  var self = this;

  return _.map(self._cache.getAllUserKeys(), function(key) {
    return self.getUser(_.last(key.name.split('/')));
  });
};
