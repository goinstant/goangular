/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the User Class which provides methods for interacting
 * with user data
 */

'use strict';

var _ = require('lodash');
var errors = require('./errors');
var safeApply = require('./safe_apply');
var emitter = require('emitter');

module.exports = User;

/**
 * Used to provide a set of defaults for
 * @public
 * @constructor
 * @class
 * @param {Object} props - User attributes
 * @param {Object} key - GoInstant key associated with this user
 * @param {Object} cache - User cache
 * @param {String} $q - Angular deferred objet
 * @param {String} $rootScope - Angular root scope
 * @returns {Object} user
 */
function User(props, key, cache, $q, $rootScope) {
  _.extend(this, {
    props: props,
    id: props.id,
    key: key,
    _cache: cache,
    _$q: $q,
    _$rootScope: $rootScope
  });

  this._setup();
}

emitter(User.prototype); // extend Emitter

/**
 * Attach a listener to the cache's change event
 */
User.prototype._setup = function() {
  var self = this;

  self._cache.on('change', function(props) {
    if (props.id != self.id) {
      return;
    }

    var newVal = self.props;
    var oldVal = self.props = props;

    self.emit('change', newVal, oldVal);
  });
};

/**
 * set the value of a user property
 * @public
 * @param {String} key - user property key
 * @param {Mixed} value - new value for the key specified
 * @param {Object} options - GoInstant set options object
 * @return {Object} promise - resolved on succesful set
 */
User.prototype.set = function(key, value, options) {
  var self = this;
  var deferred = self._$q.defer();

  if (options && !_.isSimpleObject(options)) {
    throw errors.create('UserModel', 'INVALID_ARGUMENT');
  }

  options = options || {};

  self.key.key(key).set(value, options, function(err, value) {
    //console.log('set?', value);
    if (err) {
      return  deferred.reject(err);
    }

    safeApply(self._$rootScope, function() {
      deferred.resolve(value);
    });
  });

  return deferred.promise;
};

/**
 * Get the value of a user property
 * @public
 * @param {String} key - user property key
 * @return {Mixed} value
 */
User.prototype.get = function(key) {
  if (!key) {
    return _.clone(this.props);
  }

  if (!this.props[key]) {
    return null;
  }

  return _.clone(this.props[key]);
};
