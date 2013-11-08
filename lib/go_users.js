/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the GoUser class which provides a set of low level methods
 * used to manage GoInstant users.
 */

'use strict';

var _ = require('lodash');
var errors = require('./errors');

GoUsers.debug = {
  safeApply: require('./safe_apply'),
  UserCache: require('usercache'),
  UserFactory: require('./user_factory')
};

module.exports = GoUsers;

/**
 * Instantiated by the `room` method, this constructor is not exposed.
 * @private
 * @constructor
 * @class
 * @param {Object} $rootScope - Angular root scope used to emit & broadcast
 * events
 * @param {Object} $q - Angular promise library
 * @param {Object} goConnect - GoInstant connection object
 * @param {String} room - Room name
 * @returns {Object} goUsers
 */
function GoUsers($rootScope, $q, goConnect, room) {
  _.extend(this, {
    _$rootScope: $rootScope,
    _$q: $q,
    _goConnect: goConnect,
    _room: room
  });
}

/**
 * initialize ensures a connection to GoInstant is ready, calls the setup
 * method and returns a $q promise.
 * @public
 * @returns {Object} promise
 */
GoUsers.prototype.initialize = function() {
  var deferred = this._$q.defer();
  var setup = _.bind(this._setup, this, deferred);

  this._goConnect.then(setup, deferred.reject);

  return deferred.promise;
};

/**
 * Responsible for GoUsers setup
 * @private
 * @param {Object} deferred - promise handle
 * @param {Object} goinstant - goinstant container
 */
GoUsers.prototype._setup = function(deferred, goinstant) {
  var self = this;

  // Retrieve the room (default will be 'Lobby')
  self._room = goinstant.rooms[self._room];

  if (!self._room) {
    return deferred.reject(errors.create('GoUsers', 'INVALID_ROOM'));
  }

  // Create a new UserCache
  self._userCache = new GoUsers.debug.UserCache(self._room);
  self._prepareUserFactory();
  self._bindListeners();

  self._userCache.initialize(function(err) {
    if (err) {
     return deferred.reject(err);
    }

    GoUsers.debug.safeApply(self._$rootScope, function() {
      deferred.resolve(self);
    });
  });
};

/**
 * Creates a new UserFactory and borrows exposed methods
 * @private
 */
GoUsers.prototype._prepareUserFactory = function() {
  var self = this;

  var userFactory = new GoUsers.debug.UserFactory(
    self._$q,
    self._$rootScope,
    self._userCache,
    self._room
  );

  _.map(userFactory.EXPORTED_METHODS, function(method) {
    self[method] = _.bind(userFactory[method], userFactory);
  });
};

/**
 * Attach event listeners to the `userCache`
 * @private
 */
GoUsers.prototype._bindListeners = function() {
  this._userCache.on('join', _.bind(this._joinHandler, this));
  this._userCache.on('leave',_.bind(this._leaveHandler, this));
};

/**
 * Handle join events
 * @private
 */
GoUsers.prototype._joinHandler = function(props) {
  var user = this.get(props.id);

  this._$rootScope.$broadcast('go:join', user);
};

/**
 * Handle leave events
 * @private
 */
GoUsers.prototype._leaveHandler = function(props) {
  this._$rootScope.$broadcast('go:leave', props);
};
