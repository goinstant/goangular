/* jshint browser:true, bitwise: false */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the Channel factory & class.
 */

'use strict';

var Args = require('args-js');
var _ = require('lodash');

module.exports = { factory: channelFactory, constructor: Channel };

/**
 * channelFactory
 * @public
 * @param {Object} $conn - GoInstant connection
 * @returns {Function} option validation & instance creation
 */
function channelFactory($conn) {

  /**
   * @public
   * @param {String} name - Channel name
   * @param {String} room - Room name
   */
  return function() {
    var a = new Args([
      { name: Args.STRING | Args.Required },
      { room: Args.STRING | Args.Optional },
    ], arguments);

    var chan = $conn.$channel(a.name, a.room);

    return new Channel($conn, chan);
  };
}

/**
 * Instantiated by the channel factory, this constructor accepts a channel.
 *
 * @public
 * @constructor
 * @class
 * @param {Object} $conn - GoInstant connection service
 * @param {Object} chan - GoInstant channel
 */
function Channel($conn, chan) {
  _.extend(this, {
    $$conn: $conn,
    $$chan: chan
  });
}

Channel.prototype.$message = function(value, opts) {
  var self = this;

  return self.$$conn.$ready().then(function() {
    return self.$$chan.message(value, opts);
  });
};

Channel.prototype.$equals = function(channel) {
  return this.$$chan.equals(channel.$$chan);
};

Channel.prototype.$on = function(eventname, opts, listener) {
  this.$$chan.on(eventname, opts, listener);
};

Channel.prototype.$off = function(eventname,listener) {
  this.$$chan.off(eventname, listener);
};

Channel.prototype.$room = function() {
  return this.$$chan.room();
};
