/* jshint browser:true */
/* global require, module, goinstant */

/**
 * @fileOverview
 *
 * This file contains an abstraction of the goinstant.connect method
 */

'use strict';

var _ = require('lodash');

module.exports = Connection;

/**
 * Instantiated by the Connection factory, this class allows users to configure
 * a goinstant connection during Angulars configuration stage.
 * @public
 * @constructor
 * @class
 * @example
 *  angular.module('YourApp', ['goangular'])
 *    .config(function(goConnectionProvider) {
 *      goConnectionProvider.set('https://goinstant.net/YOURACCOUNT/YOURAPP');
 *    })
 *    .controller('YourCtrl', function(goConnection) {
 *      goConnection.ready().then(function(connection) {
 *        // connected
 *      });
 *    });
 */
function Connection() {
  _.extend(this, {
    _opts: {},
    _connection: null,
    _connecting: false,
    _configured: false,
    _rooms: {}
  });
}

/**
 * Configure a future goinstant connection
 * @param {String} url - Registered application URL
 * @param {Object} [opts]
 * @config {Mixed} user - is an optional JWT or user object, defaults to 'guest'
 * @config {String} room - is an optional room name, defaults to 'lobby'
 * with the room option
 */
Connection.prototype.$set = function(url, opts) {
  if (!window.goinstant) {
    throw new Error('GoAngular requires the GoInstant library.');
  }

  this._configured = true;
  this._conn = new goinstant.Connection(url);

  _.extend(this, { _opts: (opts || {}), _url: url, _configured: true });
};

/**
 * This method is invoked by Angulars dependency injection system and initiates
 * the connection with GoInstant
 */
Connection.prototype.$get = function() {
  if (!this._connecting) {
    this._connect();
  }

  return this;
};

Connection.prototype.$key = function(keyName, roomName) {
  roomName = roomName || this._opts.room || 'lobby';

  if (!this._rooms[roomName]) {
    var self = this;

    this._rooms[roomName] = true;
    this._connection = this._connection.then(function() {
      return self._conn.room(roomName).join().then(function() {
        return self._conn;
      });
    });
  }

  return this._conn.room(roomName).key(keyName);
};

/**
 * Responsible for connecting to goinstant, assigns a promise to the private
 * connection property
 */
Connection.prototype._connect = function() {
  if (!this._configured) {
    throw new Error('The GoInstant connection must be configured first.');
  }

  var opts = _.pick(this._opts, 'user');

  this._connecting = true;
  this._connection = this._conn.connect(opts, function() {});
};

/**
 * @returns {Object} connection - a promise which will be resolved once a
 * connection has been established or rejected if an async error is encountered
 */
Connection.prototype.ready = function() {
  return this._connection;
};
