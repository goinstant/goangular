/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * PUT STUFF HERE
 */

'use strict';

var _ = require('lodash');
var errors = require('./errors');
var safeApply = require('./safe_apply');
var UserCache = require('./user_cache');
var UserFactory = require('./user_factory');

module.exports = function($rootScope, $q, goConnect) {
  var instances = {};

  return {
    room: function(room) {
      if (room && !_.isString(room)) {
        throw errors.create('goUsers', 'INVALID_ROOM');
      }

      room = room || 'lobby';

      if (instances[room]) {
        return instances[room];
      }

      instances[room] = new GoUsers($rootScope, $q, goConnect, room);

      return instances[room];
    }
  };
};

function GoUsers($rootScope, $q, goConnect, room) {
  _.extend(this, {
    _$rootScope: $rootScope,
    _$q: $q,
    _goConnect: goConnect,
    _room: room
  });
}

GoUsers.prototype.initialize = function() {
  var deferred = this._$q.defer();
  var setup = _.bind(this._setup, this, deferred);

  this._goConnect.then(setup, deferred.reject);

  return deferred.promise;
};

GoUsers.prototype._setup = function(deferred, goinstant) {
  var self = this;

  self._room = goinstant.rooms[self._room];
  self._userCache = new UserCache(self._room);
  self._prepareUserFactory();
  self._bindListeners();

  self._userCache.initialize(function(err) {
    if (err) {
     return deferred.reject(err);
    }

    safeApply(self._$rootScope, function() {
      deferred.resolve(self);
    });
  });
};

GoUsers.prototype._prepareUserFactory = function() {
  var self = this;

  var userFactory = new UserFactory(
    self._$q,
    self._$rootScope,
    self._userCache,
    self._room
  );

  _.map(userFactory.EXPORTED_METHODS, function(method) {
    self[method] = _.bind(userFactory[method], userFactory);
  });
};

GoUsers.prototype._bindListeners = function() {
  this._userCache.on('join', this._joinHandler.bind(this));
  this._userCache.on('leave', this._leaveHandler.bind(this));
};

GoUsers.prototype._joinHandler = function(props) {
  var user = this.get(props.id);

  this._$rootScope.$broadcast('go:join', user);
};

GoUsers.prototype._leaveHandler = function(props) {
  this._$rootScope.$broadcast('go:leave', props);
};
