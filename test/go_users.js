/* jshint browser:true */

describe('GoUsers', function() {

  'use strict';

  var require = window.require;
  var assert = window.assert;
  var sinon = window.sinon;
  var $q = window.Q;

  var _ = require('lodash');
  var GoUsersFactory = require('goangular/lib/go_users_factory');
  var GoUsers = require('goangular/lib/go_users');
  var errors = require('goangular/lib/errors').errorMap;

  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('Initialization', function() {
    var $rootScope, goConnect, goinstant, room;

    beforeEach(function() {
      var deferred = $q.defer();

      room = sandbox.stub();
      room.returns(room);
      room.key = sandbox.stub();
      room.join = sandbox.stub().callsArg(0);

      // Simulate Angular Dependency Injection
      $rootScope = {};
      goinstant = {};
      goinstant.rooms = { lobby: room };
      goConnect = deferred.promise;

      deferred.resolve(goinstant);
    });

    it('returns a valid goUsers object', function() {
      var goUsers = new GoUsersFactory($rootScope, $q, goConnect);

      assert.property(goUsers, 'room');
    });

    it('returns an instance go GoUsers', function() {
      var goUsers = new GoUsersFactory($rootScope, $q, goConnect);
      var lobbyUsers = goUsers.room();

      assert.instanceOf(lobbyUsers, GoUsers);
    });

    describe('Error Cases', function() {

      it('throws if passed an invalid room', function() {
        var goUsers = new GoUsersFactory($rootScope, $q, goConnect);

        assert.exception(function() {
          goUsers.room({ foo: 'bar' });
        }, 'goUsers' + errors.INVALID_ROOM);
      });

    });

    describe('goUsers#initialize', function() {
      var UserCache, UserFactory, safeApply;

      beforeEach(function() {
        UserCache = sandbox.stub();
        UserCache.returns(UserCache);
        UserCache.initialize = sandbox.stub().callsArg(0);
        UserCache.on = sandbox.stub();

        UserFactory = sandbox.stub();
        UserFactory.returns(UserFactory);

        safeApply = sandbox.stub().callsArg(1);

        GoUsers.debug = {
          UserCache: UserCache,
          safeApply: safeApply,
          UserFactory: UserFactory
        };
      });

      it('initializes successfully', function(done) {
        var goUsers = new GoUsers($rootScope, $q, goConnect, 'lobby');

        goUsers.initialize().then(function(goUsers) {
          assert.instanceOf(goUsers, GoUsers);
          done();
        });
      });

      describe('Error Cases', function() {

        it('rejects the promise if the room is not found', function(done) {
          var goUsers = new GoUsers($rootScope, $q, goConnect, 'foo');

          goUsers.initialize().then(function(){
            return;
          }, function(err) {
            assert(err.message, errors.INVALID_ROOM);
            done();
          });
        });

      });
    });
  });
});
