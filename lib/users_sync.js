/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the UsersSync class, used to create a binding between
 * a model on $scope and a GoInstant .users collection.
 */
'use strict';

var _ = require('lodash');
var KeySync = require('./key_sync');

module.exports = UsersSync;

/**
 *
 */
function UsersSync($parse, $timeout, key) {
  _.bindAll(this, [
    '$initialize',
    '$$handleJoin',
    '$$handleLeave'
  ]);

  _.extend(this, {
    $parse: $parse,
    $timeout: $timeout,
    $$key: key,
    $$roomRegistry: {},
    $$super: KeySync.prototype
  });
}

// Inherit KeySync
UsersSync.prototype = new KeySync();
UsersSync.prototype.constructor = UsersSync;


/**
 *
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

  this.$$super.$initialize.call(this, model);
};

UsersSync.prototype.$$handleJoin = function(user) {
  var self = this;

  this.$timeout(function() {
    self.$$model[user.id] = user;
    self.$$model.$$emitter.emit('join', user);
  });
};

UsersSync.prototype.$$handleLeave = function(user) {
  var self = this;

  this.$timeout(function() {
    delete self.$$model[user.id];
    self.$$model.$$emitter.emit('leave', user);
  });
};
