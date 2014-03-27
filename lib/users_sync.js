/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the UsersSync class, used to create a binding between
 * a model on $scope and the GoInstant .users key
 */

'use strict';

/* @todo slowly phase out external dependencies */
var _ = require('lodash');
var inheritPrototype = require('./util/inherit');
var KeySync = require('./key_sync');

module.exports = UsersSync;

/**
 * The UsersSync class is responsible for synchronizing the state of a local
 * model with that of a GoInstant .users key.
 *
 * @constructor
 * @extends KeySync
 */
function UsersSync() {
  KeySync.apply(this, arguments);

  _.bindAll(this, [
    '$initialize',
    '$$handleJoin',
    '$$handleLeave'
  ]);

  this.$$roomRegistry = {};
}

inheritPrototype(UsersSync, KeySync);

/**
 * Creates an association between a local object and a .users key in GoInstant
 * by monitoring when a user joins and leaves the room.
 * @param {Object} model - local object
 * @extends KeySync#$initialize
 */
UsersSync.prototype.$initialize = function(model) {
  _.extend(this.$$roomRegistry, {
    join: this.$$handleJoin,
    leave: this.$$handleLeave
  });

  var room = this.$$key.room();

  _.each(this.$$roomRegistry, function(fn, event) {
    room.on(event, { local: true }, fn);
  });

  KeySync.prototype.$initialize.call(this, model);
};

/**
 * Handles adding a new user to the model when they join the room
 * @param {Object} user A GoInstant userObject
 */
UsersSync.prototype.$$handleJoin = function(user) {
  var self = this;

  this.$timeout(function() {
    self.$$model[user.id] = user;
    self.$$model.$$emitter.emit('join', user);
  });
};

/**
 * Handles removing a new user from the model when they leave the room
 * @param {Object} user A GoInstant userObject
 */
UsersSync.prototype.$$handleLeave = function(user) {
  var self = this;

  this.$timeout(function() {
    delete self.$$model[user.id];
    self.$$model.$$emitter.emit('leave', user);
  });
};
