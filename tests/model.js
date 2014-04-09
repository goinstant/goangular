/* jshint browser:true */
/* global require */

describe('GoAngular.Model', function() {

  'use strict';

  var _ = require('lodash');
  var assert = require('gi-assert');
  var sinon = require('sinon');

  /* Component Dependencies */
  var Model = require('../lib/model');
  var KeyModel = require('../lib/key_model');
  var UsersModel = require('../lib/users_model');

  var sandbox;
  var fakeRoom;
  var fakeKey;
  var fakeSync;
  var fakeConn;
  var fakePromise;
  var initialize;
  var factory;
  var fake$q;

  before(function() {
    sandbox = sinon.sandbox.create();
  });

  beforeEach(function() {
    fakeRoom = createFakeRoom('lobby');
    fakeKey = createFakeKey('todos');

    fakePromise = {
      then: function(cb) { cb(); return fakePromise; },
      fail: sandbox.stub()
    };

    fake$q = {
      defer: sandbox.stub().returns({
        promise: sinon.stub(),
        resolve: sinon.stub()
      })
    };

    initialize = sandbox.stub();

    fakeConn = {
      $ready: sandbox.stub().returns(fakePromise),
      $$conn: {
        loginUrl: sandbox.stub().returns('loginUrl'),
        logoutUrl: sandbox.stub().returns('logoutUrl')
      }
    };

    fakeSync = {
      $initialize: initialize,
      $timeout: sandbox.stub().callsArg(0)
    };

    factory = sinon.stub().returns({
      $sync: sinon.stub().returns(fakeSync),
      $on: sinon.stub()
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  function createFakeKey(name) {
    var fakeKey = {
      name: name,
      room: sandbox.stub().returns(fakeRoom),
      set: sandbox.stub(),
      add: sandbox.stub(),
      remove: sandbox.stub(),
      on: sandbox.stub(),
      off: sandbox.stub()
    };

    fakeKey.key = sandbox.spy(function() { return fakeKey; });

    return fakeKey;
  }

  function createFakeRoom(name) {
    return {
      name: name,
      on: sandbox.stub(),
      off: sandbox.stub(),
      join: sandbox.stub(),
      leave: sandbox.stub(),
      users: createFakeKey('.users'),
      self: sandbox.stub().returns(createFakeKey('.users/1234'))
    };
  }

  describe('Model', function() {
    var model;

    beforeEach(function() {
      model = new Model(fakeConn, fakeKey, fakeSync, factory);
    });

    describe('$sync', function() {

      it('delegates to sync object', function() {
        model.$sync();

        sinon.assert.calledWith(initialize, model);
      });
    });

    describe('$key', function() {

      it('creates a new instance of model', function() {
        model.$key('keyName');
        var expectedKey = model.$$key.key('keyName');

        sinon.assert.calledOnce(factory);
        sinon.assert.calledWith(factory, expectedKey);
      });
    });

    describe('$omit', function() {

      it('returns an object sans $-prefixed properties', function() {
        model.foo = 'bar';
        var result = model.$omit();

        assert.deepEqual(result, { foo: 'bar' });
      });
    });

    describe('$on', function() {
      it('throws on invalid eventName', function() {
        assert.exception(function() {
          model.$on('fakeEvent', sinon.stub());
        }, 'Invalid event name: fakeEvent');
      });

      it('accepts valid events', function() {
        sandbox.spy(model.$$emitter, 'on');

        var fakeListener = sinon.stub();

        model.$on('error', fakeListener);
        model.$on('ready', fakeListener);

        sinon.assert.calledTwice(model.$$emitter.on);
        sinon.assert.calledWith(model.$$emitter.on, 'error', fakeListener);
        sinon.assert.calledWith(model.$$emitter.on, 'ready', fakeListener);
      });
    });

    describe('$off', function() {
      it('accepts valid events', function() {
        sinon.spy(model.$$emitter, 'off');

        var fakeListener = sinon.stub();

        model.$off('error', fakeListener);
        model.$off('ready', fakeListener);

        sinon.assert.calledTwice(model.$$emitter.off);
        sinon.assert.calledWith(model.$$emitter.off, 'error', fakeListener);
        sinon.assert.calledWith(model.$$emitter.off, 'ready', fakeListener);
      });
    });
  });

  describe('KeyModel', function() {
    var model;

    beforeEach(function() {
      model = new KeyModel(fakeConn, fakeKey, fakeSync, factory);
    });

    describe('$set', function() {

      it('sets the value of the key', function() {
        model.$set('foo');

        sinon.assert.calledWith(fakeKey.set, 'foo');
      });
    });

    describe('$add', function() {

      it('sets the value of the key', function() {
        model.$add('foo');

        sinon.assert.calledWith(fakeKey.add, 'foo');
      });
    });

    describe('$remove', function() {

      it('removes a key', function() {
        model.$remove();

        sinon.assert.calledOnce(fakeKey.remove);
      });
    });

    describe('$on', function() {
      it('calls key#on', function() {
        var fakeListener = sinon.stub();

        var fakeOpts = {
          local: true,
          bubble: true
        };

        model.$on('set', fakeOpts, fakeListener);
        model.$on('add', fakeListener);
        model.$on('remove', fakeListener);

        sinon.assert.calledThrice(fakeKey.on);
        sinon.assert.calledWith(fakeKey.on, 'set', fakeOpts, fakeListener);
        sinon.assert.calledWith(fakeKey.on, 'add', fakeListener);
        sinon.assert.calledWith(fakeKey.on, 'remove', fakeListener);
      });
    });

    describe('$off', function() {
      it('calls key#off', function() {
        var fakeListener = sinon.stub();

        var fakeOpts = {
          local: true,
          bubble: true
        };

        model.$off('set', fakeOpts, fakeListener);
        model.$off('add', fakeListener);
        model.$off('remove', fakeListener);

        sinon.assert.calledThrice(fakeKey.off);
        sinon.assert.calledWith(fakeKey.off, 'set', fakeOpts, fakeListener);
        sinon.assert.calledWith(fakeKey.off, 'add', fakeListener);
        sinon.assert.calledWith(fakeKey.off, 'remove', fakeListener);
      });
    });
  });

  describe('UsersModel', function() {
    var model;

    beforeEach(function() {
      model = new UsersModel(fakeConn, fakeKey, fakeSync, factory, fake$q);
    });

    describe('$self', function() {
      it('resolves a factory', function() {
        model.$self();

        sinon.assert.calledOnce(fake$q.defer);
        //sinon.assert.calledWith(model.$$selfFactory, fakeRoom.self());
      });
    });

    describe('$getUser', function() {
      it('is an alias for $key', function() {
        assert.equal(UsersModel.prototype.$getUser, KeyModel.prototype.$key);
      });
    });

    describe('$on', function() {
      var onSpy;

      beforeEach(function() {
        onSpy = sandbox.spy(KeyModel.prototype, '$on');
      });

      it('calls room#on', function() {
        var fakeListener = sinon.stub();
        var fakeOpts = {
          local: true
        };

        model.$on('join', fakeListener);
        model.$on('leave', fakeOpts, fakeListener);

        sinon.assert.calledTwice(fakeRoom.on);
        sinon.assert.calledWith(fakeRoom.on, 'join', fakeListener);
        sinon.assert.calledWith(fakeRoom.on, 'leave', fakeOpts, fakeListener);
      });
    });

    describe('$off', function() {
      var offSpy;

      beforeEach(function() {
        offSpy = sandbox.spy(KeyModel.prototype, '$off');
      });

      it('calls room#off', function() {
        var fakeListener = sinon.stub();
        var fakeOpts = {
          local: true
        };

        model.$off('join', fakeListener);
        model.$off('leave', fakeOpts, fakeListener);

        sinon.assert.calledTwice(fakeRoom.off);
        sinon.assert.calledWith(fakeRoom.off, 'join', fakeListener);
        sinon.assert.calledWith(fakeRoom.off, 'leave', fakeOpts,
                                fakeListener);
      });
    });
  });
});
