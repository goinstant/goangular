/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file contains the GoAngular class which synchronizes controller
 * specific $scope between clients.
 */

'use strict';

var _ = require('lodash');
var errors = require('./errors');
var async = require('async');
var emitter = require('emitter');
var safeApply = require('./safe_apply');


/** @constant {String} GoInstant key namespace */

var GOINSTANT_KEY_NAMESPACE = 'goinstant/integrations/go-angular';

module.exports = GoAngular;

GoAngular.ModelBinder = require('./model_binder');
GoAngular.ScopeScrubber = require('./scope_scrubber');

/**
 * Instantiated by the goAngular factory, this creates a 2-way binding
 * between strings, objects & arrays on the $scope object.  It should be passed
 * a unique keyName. If passed the include option, it will only sync the
 * models specified.
 * @public
 * @constructor
 * @class
 * @param {Object} scope - Angular controller $scope
 * @param {String} namespace - GoInstant key name unique to this controller
 * @param {Object} opts
 * @config {Mixed} [room] - GoInstant room
 * @config {Array} [include] - An array of strings or regex
 * @config {Array} [exclude] - An array of strings or regex
 * @param {Object} $q - Angular promise library
 * @param {Function} $parse - Angular parse
 * @param {Object} goConnection - a promise which will resolve to a connection
 * @example
 *   var goAngular = new GoAngular({
 *     scope: $scope,
 *     roomName: 'roomName',
 *     keyName: 'aUniqueKey'
 *   })
 */
function GoAngular(scope, namespace, opts, $q, $parse, goConnection) {
  applyOptions(this, opts);

  _.extend(this, {
    _scope: scope,
    _namespace: namespace,
    _goConnection: goConnection,
    _deferred: $q.defer(),
    _parse: $parse,
    _boundKeys: [] // Previously bound model keys
  });

  _.bindAll(this);
}

emitter(GoAngular.prototype); // extend Emitter

/**
 * Responsible for initial scope <=> goinstant bindings
 * @public
 * @returns {Object} promise which will resolve to an instance of this class
 */
GoAngular.prototype.initialize = function() {
  var self = this;
  var ModelBinder = GoAngular.ModelBinder;
  var ScopeScrubber = GoAngular.ScopeScrubber;

  // Resolves once goinstant connection is established
  self._connect(function(err) {
    if (err) {
      return safeApply(self._scope, function() {
       self._deferred.reject(err);
      });
    }

    // Creates the data binding between scope and goinstant
    self._modelBinder = new ModelBinder(self._scope, self._parse, self._key);

    var scopeFilterOptions = {
      _include: (self._include || []),
      _exclude: (self._exclude || [])
    };

    // Ensure only valid models are synchronized
    self._scopeScrubber = new ScopeScrubber(scopeFilterOptions);
    self._boundKeys = self._scopeScrubber.clean(self._scope);  // return keys

    // For each valid key in scope, create a binding
    async.each(
      self._boundKeys,
      self._modelBinder.newBinding,
      function(err) {
        if (err) {
          return safeApply(self._scope, function() {
            self._deferred.reject(err);
          });
        }

        // Monitor scope for changes
        self._monitorScope();

        // Resolve the promise
        safeApply(self._scope, function() {
          self._deferred.resolve(self);
        });
      }
    );
  });

  return this._deferred.promise;
};

GoAngular.prototype._connect = function(cb) {
  var self = this;

  self._goConnection.ready().get('connection').then(function(connection) {

      return connection.room((self._room || 'lobby')).join().get('room');
    }).then(function(room) {

      self._key = room.key(GOINSTANT_KEY_NAMESPACE).key(self._namespace);
      cb(null);
    }).fail(cb);
};

/**
 * Watches the scope for changes
 * @private
 */
GoAngular.prototype._monitorScope = function() {
  this._scope.$watch(this._handleScopeChanges);
};

/**
 * Creates remote/local bindings for new [valid] models
 * @private
 * @todo handle errors when no listeners are available
 * Debounced due to the frequency with which $watch is fired
 */
GoAngular.prototype._handleScopeChanges = _.debounce(function() {
  var self = this;

  var currentScope = this._scopeScrubber.clean(self._scope);
  var newModels = _.difference(currentScope, this._boundKeys);

  if (newModels.length <= 0) {
    return;
  }

  async.each(
    newModels,
    this._modelBinder.newBinding,
    function(err) {
      if (err) {
        return self.emit('error', err);
      }

      self._boundKeys = _.union(self._boundKeys, newModels);
    }
  );

}, 500);

/**
 * Clean up bindings and listeners
 * @public
 * @param {requestCallback} cb - The callback that handles the response.
 * @param {err} returns null if no error is encountered
 * @todo handle errors when no listeners are available
 */
GoAngular.prototype.destroy = function destroy(cb) {
  if (cb && !_.isFunction(cb)) {
    throw errors.create('GoAngular', 'INVALID_CALLBACK');
  }

  this._modelBinder.cleanup(cb);
};

/**
 * Helpers
 * @todo Abstract to a helper lib
 */
function applyOptions(context, opts) {
  _.each(opts, function(value, key) {
    context['_' + key] = value;
  });
}
