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
    _configured: false
  });
}

/**
 * Configure a future goinstant connection
 * @param {String} url - Registered application URL
 * @param {Object} [opts]
 * @config {Mixed} user - is an optional JWT or user object, defaults to 'guest'
 * @config {String} room - is an optional room name, defaults to 'lobby'
 * @config {Array} rooms - An array of room names cannot be used in conjunction
 * with the room option
 */
Connection.prototype.set = function(url, opts) {
  this._configured = true;

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

/**
 * Responsible for connecting to goinstant, assigns a promise to the private
 * connection property
 */
Connection.prototype._connect = function() {
  if (!this._configured) {
    throw new Error('The goinstant connection must be configured.');
  }

  this._connecting = true;
  this._connection = goinstant.connect(this._url, this._opts).get('connection');
};

/**
 * @returns {Object} connection - a promise which will be resolved once a
 * connection has been established or rejected if an async error is encountered
 */
Connection.prototype.ready = function() {
  return this._connection;
};
