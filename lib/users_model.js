/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the UsersModel class, an Angular friendly .users key
 * wrapper
 */

'use strict';

var _ = require('lodash');
var inheritPrototype = require('./util/inherit');
var Model = require('./model');
var KeyModel = require('./key_model');

module.exports = UsersModel;

var ROOM_EVENTS = ['join', 'leave'];
var SELF = 'self';

/**
 * @public
 * @constructor
 * @class
 * @extends Model
 */
function UsersModel() {
  Model.apply(this, arguments);

  _.bindAll(this, [
    '$getUser',
    '$on',
    '$off'
  ]);

  _.extend(this, {
    $local: null,
    $$q: arguments[4]
  });
}

inheritPrototype(UsersModel, Model);

/**
 * Give the current key a new value
 * @public
 * @param {Boolean} sync - Default true, automatically syncs when called
 * @returns {Object} promise
 */
UsersModel.prototype.$self = function(sync) {
  var self = this;

  sync = _.isBoolean(sync) ? sync : true;

  var defer = this.$$q.defer();

  this.$$conn.$ready().then(function() {
    var key = self.$$key.room().self();

    self.$$sync.$timeout(function() {
      self.$local = self.$$factory(key);

      if (sync) {
        self.$local.$sync();
        self.$local.$on('ready', function() {
          defer.resolve(self.$local);
        });

      } else {
        defer.resolve(self.$local);
      }
    });
  });

  return defer.promise;
};

/**
 * Create and return a new instance of Model, with a relative key.
 * @public
 * @param {String} keyName - Key name
 */
UsersModel.prototype.$getUser = KeyModel.prototype.$key;

/**
 * Bind a listener to events on this room
 * @public
 * @extends KeyModel#on
 */
UsersModel.prototype.$on = function(eventName, opts, listener) {
  if (_.contains(ROOM_EVENTS, eventName)) {
    return this.$$key.room().on(eventName, opts, listener);
  }

  KeyModel.prototype.$on.call(this, eventName, opts, listener);
};

/**
 * Remove a listener on this room. If the eventName is empty, call off on both
 * the room and key model (KeyModel.prototype.off).
 * @public
 * @extends KeyModel#off
 */
UsersModel.prototype.$off = function(eventName, opts, listener) {
  if (_.contains(ROOM_EVENTS, eventName)) {
    return this.$$key.room().off(eventName, opts, listener);

  } else if (!eventName) {
    this.$$key.room().off(eventName, opts, listener);
  }

  KeyModel.prototype.$off.call(this, eventName, opts, listener);
};
