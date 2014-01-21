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
 *      goConnection.$ready().then(function(connection) {
 *        // connected
 *      });
 *    });
 */
function Connection() {
  _.extend(this, {
    $$opts: {},
    $$connection: null,
    $$connecting: false,
    $$configured: false,
    $$rooms: {}
  });
}

/**
 * Configure & connect to GoInstant
 * @param {String} url - Registered application URL
 * @param {Object} [opts]
 * @config {Mixed} user - is an optional JWT or user object, defaults to 'guest'
 * @config {String} room - is an optional room name, defaults to 'lobby'
 * with the room option
 */
Connection.prototype.$connect = function(url, opts) {
  if (this.$$configured) {
    throw new Error(
      '$connect should not be used in conjunction with $set or invoked twice'
    );
  }

  if (this.$$connection) {
    return this.$$connection;
  }

  this.$set(url, opts);
  this.$$connect();

  return this.$$connection;
};

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

  this.$$configured = true;
  this.$$conn = new goinstant.Connection(url);

  _.extend(this, { $$opts: (opts || {}), $$url: url, $$configured: true });
};

/**
 * This method is invoked by Angulars dependency injection system and initiates
 * the connection with GoInstant
 */
Connection.prototype.$get = function() {
  if (!window.goinstant) {
    throw new Error('GoAngular requires the GoInstant library.');
  }

  if (this.$$configured && !this.$$connecting) {
    this.$$connect();
  }

  return this;
};

Connection.prototype.$key = function(keyName, roomName) {
  if (!this.$$configured) {
    throw new Error(
      'You must configure you connection first. ' +
      'Find additional details: ' +
      'https://developers.goinstant.com/v1/GoAngular/connection.html');
  }

  roomName = roomName || this.$$opts.room || 'lobby';

  if (!this.$$rooms[roomName]) {
    var self = this;

    this.$$rooms[roomName] = true;
    this.$$connection = this.$$connection.then(function() {
      return self.$$conn.room(roomName).join().then(function() {
        return self.$$conn;
      });
    });
  }

  return this.$$conn.room(roomName).key(keyName);
};

/**
 * Responsible for connecting to goinstant, assigns a promise to the private
 * connection property
 */
Connection.prototype.$$connect = function() {
  if (!this.$$configured) {
    throw new Error('The GoInstant connection must be configured first.');
  }

  var user  = this.$$opts.user || {};

  this.$$connecting = true;
  this.$$connection = this.$$conn.connect(user || {}, function() {});
};

/**
 * @returns {Object} connection - a promise which will be resolved once a
 * connection has been established or rejected if an async error is encountered
 */
Connection.prototype.$ready = function() {
  if (!this.$$configured) {
    throw new Error(
      'You must configure you connection first.' +
      'Find additional details:' +
      ' https://developers.goinstant.com/v1/GoAngular/connection.html');
  }

  return this.$$connection;
};
