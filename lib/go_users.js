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
var emitter = require('emitter');

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
    _room: room,
    _initialized: null
  });

  _.bindAll(this, ['_setup', '_joinHandler', '_leaveHandler']);
}

emitter(GoUsers.prototype); // extend Emitter

/**
 * initialize ensures a connection to GoInstant is ready, calls the setup
 * method and returns a $q promise.
 * @public
 * @returns {Object} promise
 */
GoUsers.prototype.initialize = function() {
  if (this._initialized) {
    return this._initialized.promise;
  }

  this._initialized = this._$q.defer();
  this._goConnect.then(this._setup, this._initialized.reject);

  return this._initialized.promise;
};

/**
 * initialize ensures a connection to GoInstant is ready, calls the setup
 * method and returns a $q promise.
 * @public
 * @returns {Object} promise
 */
GoUsers.prototype.destroy = function() {
  var self = this;

  var deferred = self._$q.defer();

  self._userCache.destroy(function(err) {
    if (err) {
      self._$rootScope.$apply(function() {
        deferred.reject(err);
      });
    }

    self._$rootScope.$apply(function() {
      deferred.resolve();
    });
  });

  return deferred.promise;
};

/**
 * Responsible for GoUsers setup
 * @private
 * @param {Object} goinstant - goinstant connection and joined rooms
 */
GoUsers.prototype._setup = function(goinstant) {
  var self = this;

  // Retrieve the room (default will be 'lobby')
  self._room = goinstant.rooms[self._room];

  if (!self._room) {
    return self._initialized.reject(errors.create('GoUsers', 'INVALID_ROOM'));
  }

  // Create a new UserCache
  self._userCache = new GoUsers.debug.UserCache(self._room);
  self._prepareUserFactory();
  self._bindListeners();

  self._userCache.initialize(function(err) {
    if (err) {
      return self._initialized.reject(err);
    }

    GoUsers.debug.safeApply(self._$rootScope, function() {
      self._initialized.resolve(self);
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
  this._userCache.on('join', this._joinHandler);
  this._userCache.on('leave', this._leaveHandler);
};

/**
 * Handle join events
 * @private
 */
GoUsers.prototype._joinHandler = function(props) {
  var user = this.get(props.id);

  this.emit('join', user);
};

/**
 * Handle leave events
 * @private
 */
GoUsers.prototype._leaveHandler = function(props) {
  this.emit('leave', props);
};
