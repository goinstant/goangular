/* jshint browser:true */

describe('GoUsers: User Model & Factory', function() {

  'use strict';

  var require = window.require;
  var assert = window.assert;
  var sinon = window.sinon;
  var $q = window.Q;

  var _ = require('lodash');
  var errors = require('goangular/lib/errors').errorMap;

  var UserFactory = require('goangular/lib/user_factory');
  var User = require('goangular/lib/user_model');

  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('userFactory initialization', function() {
    var props, key, cache, $rootScope;

    beforeEach(function() {
      props = { displayName: 'foo' };
      cache = sandbox.stub();
      cache.getUser = sandbox.stub().returns(props);
      cache.getUserKey = sandbox.stub().returns(1);
      key = sandbox.stub().returns(createFakeKey());

      $rootScope = {};
    });

    it('returns a User factory', function() {
      var userFactory = new UserFactory();

      assert.instanceOf(userFactory, UserFactory);
    });

    describe('user', function() {
      var FakeUserModel, userFactory, id;

      beforeEach(function() {
        id = 'one';

        FakeUserModel = sandbox.stub().returns(props);
        UserFactory.debug = { User: FakeUserModel };

        userFactory = new UserFactory($q, $rootScope, cache, 'lobby');
      });

      it('creates and returns a user', function() {
        userFactory.user(id);

        assert(FakeUserModel.calledOnce);
      });

      describe('error cases', function() {

        it('throws when passed an invalid user ID', function() {
          assert.exception(function() {
            userFactory.user();
          }, 'goUsers' + errors.INVALID_ID);
        });

      });
    });

    describe('self', function() {
      var FakeUserModel, userFactory, id;

      beforeEach(function() {
        id = 'one';

        FakeUserModel = sandbox.stub().returns(props);
        UserFactory.debug = { User: FakeUserModel };
        cache.getLocalUser = sinon.stub().returns({ id: 'one' });

        userFactory = new UserFactory($q, $rootScope, cache, 'lobby');
      });

      it('returns the current user', function() {
        userFactory.self();

        assert(cache.getLocalUser.calledOnce);
        assert(FakeUserModel.calledOnce);
      });

    });

    describe('users', function() {
      var FakeUserModel, userFactory, id;

      beforeEach(function() {
        id = 'one';

        FakeUserModel = sandbox.stub().returns(props);
        UserFactory.debug = { User: FakeUserModel };

        cache.getAllUserKeys = sinon.stub().returns([
          { name: 'key/one' },
          { name: 'key/one' }
        ]);

        userFactory = new UserFactory($q, $rootScope, cache, 'lobby');
      });

      it('returns an array of all users', function() {
        userFactory.users();

        // called once, second request should be cached
        assert(FakeUserModel.calledOnce);
      });

    });
  });

  describe('userModel initalization', function() {
    var props, key, cache, $rootScope;

    beforeEach(function() {
      User.debug.safeApply = sandbox.stub().callsArg(1);

      props = { id: 'foo', displayName: 'bar' };
      cache = sandbox.stub();
      cache.on = sandbox.stub();
      key = createFakeKey();

      $rootScope = {};
    });

    it('returns a user model', function() {
      var user = new User(props, key, cache, $q, $rootScope);

      assert(cache.on.calledOnce);
      assert.instanceOf(user, User);
    });

    describe('#set', function() {
      var user;

      beforeEach(function() {
        user = new User(props, key, cache, $q, $rootScope);
      });

      it('sets the correct key, with the correct value', function() {
        var keyName = 'displayName';
        var value = 'foo';

        user.set(keyName, value);

        assert(key.key.calledWith(keyName));
        assert(key.set.calledWith(value));
      });

      describe('error cases', function() {
        var validKey = 'foo';
        var validValue = 'bar';

        var errorCases = [
          {
            description: 'throws if provided an invalid key',
            args: [ ['foo'], validValue ],
            error: 'INVALID_KEY'
          },
          {
            description: 'throws if provided invalid value',
            args: [ validKey ],
            error: 'INVALID_ARGUMENT'
          },
          {
            description: 'throws if provided invalid options',
            args: [ validKey, validValue, ['foo'] ],
            error: 'INVALID_ARGUMENT'
          }
        ];

        _.each(errorCases, function(errorCase) {
          it(errorCase.description, function() {
            assert.exception(function() {
              user.set.apply(user, errorCase.args);
            }, errors['UserModel' + errorCase.error]);
          });
        });
      });
    });

    describe('#get', function() {
      var user;

      beforeEach(function() {
        user = new User(props, key, cache, $q, $rootScope);
      });

      it('returns the value associated with a key', function() {
        var result = user.get('displayName');

        assert.equal(result, props.displayName);
      });

      it('returns null if no value is associated with the key', function() {
        var result = user.get('foo');

        assert(_.isNull(result));
      });

      describe('error cases', function() {

        it('throws if an invalid key is provided', function() {
          assert.exception(function() {
            user.get();
          }, 'UserModel' + errors.INVALID_KEY);
        });

      });
    });

    describe('#getAll', function() {
      var user;

      beforeEach(function() {
        user = new User(props, key, cache, $q, $rootScope);
      });

      it('returns a user\'s properties', function() {
        var result = user.getAll();

        assert.sameMembers(result, props);
      });

    });
  });

  function createFakeKey(name) {
    var fakeKey = {
      name: name,
      get: sandbox.stub().yields(),
      set: sandbox.stub().yields(),
      remove: sandbox.stub().yields(),
      on: sandbox.stub().callsArg(2),
      off: sandbox.stub().callsArg(2)
    };
    fakeKey.key = sinon.spy(function() { return fakeKey; });

    return fakeKey;
  }

});
