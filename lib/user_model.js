/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * PUT STUFF HERE
 */

'use strict';

var _ = require('lodash');
var errors = require('./errors');
var safeApply = require('./safe_apply');
var emitter = require('emitter');


module.exports = User;

function User(props, key, cache, $q, $rootScope) {
  this.$q = $q;
  this.$rootScope = $rootScope;
  this.props = props;
  this.id = props.id;
  this.key = key;
  this.cache = cache;
  this._setup();
}

emitter(User.prototype); // extend Emitter

User.prototype._setup = function() {
  var self = this;

  self.cache.on('change', function(props) {
    if (props.id != self.id) {
      return;
    }

    var newVal = self.props;
    var oldVal = self.props = props;

    self.emit('change', newVal, oldVal);
  });
};

User.prototype.set = function(key, value, options) {
  var self = this;
  var deferred = self.$q.defer();

  if (options && !_.isSimpleObject(options)) {
    throw new Error('Invalid argument');
  }

  options = options || {};

  self.key.key(key).set(value, options, function(err, value) {
    //console.log('set?', value);
    if (err) {
      return  deferred.reject(err);
    }

    safeApply(self.$rootScope, function() {
      deferred.resolve(value);
    });
  });

  return deferred.promise;
};

User.prototype.get = function(key) {
  if (!key) {
    return _.clone(this.props);
  }

  if (!this.props[key]) {
    return null;
  }

  return _.clone(this.props[key]);
};
