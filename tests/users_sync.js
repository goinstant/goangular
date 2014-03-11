/* jshint browser:true */
/* global require */

describe('GoAngular.usersSync', function() {

  'use strict';

  var assert = require('gi-assert');
  var sinon = require('sinon');

  /* Component Dependencies */
  var usersSync = require('../lib/users_sync_factory');
  var KeySync = require('../lib/key_sync');

  var sandbox;
  var fakeRoom;
  var fakeKey;
  var model;
  var primitiveInt;
  var primitiveStr;
  var primitiveBool;
  var collection;
  var list;
  var factory;
  var $timeout;
  var $parse;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    fakeRoom = createFakeRoom('lobby');
    fakeKey = createFakeKey('.users');
    model = {
      $$emitter: {},
      $$key: fakeKey
    };

    model.$$emitter.emit = sinon.stub();

    primitiveInt = 1;
    primitiveStr = 'foo';
    primitiveBool = false;
    collection = { foo: 'bar', bar: 'foo' };
    list = ['foo', 'bar'];
    $parse = sandbox.stub();
    $timeout = sandbox.stub().callsArg(0);
  });

  afterEach(function() {
    sandbox.restore();
  });

  function createFakeKey(name) {
    var fakeKey = {
      name: name,
      room: sandbox.stub().returns(fakeRoom),
      get: sandbox.stub().yields(null, 1),
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
      users: createFakeKey('.users')
    };
  }

  describe('initialization', function() {
    var sync;
    var keySyncSpy;

    beforeEach(function() {
      factory = usersSync($parse, $timeout, fakeKey);
      sync = factory(fakeKey);
      model = {};
      model.$$emitter = {};
      model.$$emitter.emit = sinon.stub();
      model.$$key = fakeKey;
    });

    beforeEach(function() {
      keySyncSpy = sandbox.spy(KeySync.prototype, '$initialize');

      sync.$initialize(model);
    });

    describe('$initialize', function() {
      it('registers room listeners', function() {
        var opts = {
          local: true
        };

        sinon.assert.calledTwice(fakeRoom.on);
        sinon.assert.calledWith(fakeRoom.on, 'join', opts,
          sync.$$handleJoin);
        sinon.assert.calledWith(fakeRoom.on, 'leave', opts,
          sync.$$handleLeave);
      });

      it('$initializes its superclass, keySync', function() {
        sinon.assert.calledOnce(keySyncSpy);
        sinon.assert.calledOnce(model.$$emitter.emit);
        sinon.assert.calledWith(model.$$emitter.emit, 'ready');
      });
    });

    describe('$$handleJoin', function() {
      it('adds the user to the model', function() {
        var fakeUser = {
          id: '1234',
          displayName: 'Foo Bar'
        };

        sync.$$handleJoin(fakeUser);

        sinon.assert.calledTwice(model.$$emitter.emit);
        sinon.assert.calledTwice($timeout);
        sinon.assert.calledWith(model.$$emitter.emit, 'join', fakeUser);

        assert.deepEqual(model[fakeUser.id], fakeUser);
      });
    });

    describe('$$handleRemove', function() {
      it('deletes the user from the model', function() {
        var fakeUser1 = {
            id: '1234',
            displayName: 'Foo Bar'
        };

        var fakeUser2 = {
          id: '5678',
          displayName: 'Bar Foo'
        };

        sync.$$handleJoin(fakeUser1);
        sync.$$handleJoin(fakeUser2);

        assert.deepEqual(model[fakeUser1.id], fakeUser1);
        assert.deepEqual(model[fakeUser2.id], fakeUser2);

        sync.$$handleLeave(fakeUser2);

        assert.equal(model.$$emitter.emit.callCount, 4);
        assert.equal($timeout.callCount, 4);
        sinon.assert.calledWith(model.$$emitter.emit, 'leave', fakeUser2);

        assert.isUndefined(model[fakeUser2.id]);
      });
    });
  });
});
