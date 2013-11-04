/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the GoUser class which provides a low level set of methods
 * which can be used to manage GoInstant users.
 */

'use strict';

var _ = require('lodash');
var errors = require('./errors');
var safeApply = require('./safe_apply');
var UserCache = require('usercache');
var UserFactory = require('./user_factory');

/**
 * @public
 * @param {Object} $rootScope - use to emit & broadcast events
 * @param {Object} $q - Angular promise library
 * @param {Object} goConnect - GoInstant connection object
 * @returns {Function} option validation & instance creation
 */
module.exports = function($rootScope, $q, goConnect) {
  // container for instances of GoUsers
  var instances = {};

  /**
   * room returns a new or existing instance of GoUsers associated with the
   * room provided
   * @public
   * @param {String} room - To maintain consistency with the GoInstant API we
   * provide a `room` method, used to specify the room you wish to connect to.
   *
   * @example
   *   goUsers.room('YOUROOM').initialize().then(...
   */
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
 * @param {Object} $rootScope - use to emit & broadcast events
 * @param {Object} $q - Angular promise library
 * @param {Object} goConnect - GoInstant connection object
 * @param {String} room - Room name
 * @returns {Object} goUsers - a promise which will resolve to a goUsers object
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
 * @param {Object} deferred - an angular deferred object
 * @param {Object} goinstant - active goinstant object
 */
GoUsers.prototype._setup = function(deferred, goinstant) {
  var self = this;

  // Retrieve the room (default will be 'Lobby')
  self._room = goinstant.rooms[self._room];
  // Create a new UserCache
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

/**
 * Creates a new UserFactory and borrows exposed methods
 * @private
 */
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

/**
 * Attach event listeners to the `userCache`
 * @private
 */
GoUsers.prototype._bindListeners = function() {
  this._userCache.on('join', this._joinHandler.bind(this));
  this._userCache.on('leave', this._leaveHandler.bind(this));
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
