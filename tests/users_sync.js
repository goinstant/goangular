/* jshint browser:true */

describe('GoAngular.usersSync', function() {

  'use strict';

  var require = window.require;
  var assert = window.assert;
  var sinon = window.sinon;

  /* Component Dependencies */
  var keySync = require('goangular/lib/users_sync_factory');

  var sandbox;
  var fakeRoom;
  var fakeKey;
  var fakeUser;
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
    fakeKey = createFakeKey('fakeKey');
    fakeUser = {
      id: 12345,
      displayName: 'Test User'
    };
    model = {};
    model.$$emitter = {};
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

  describe('initialization', function() {
    var sync;

    beforeEach(function() {
      factory = keySync($parse, $timeout);
      sync = factory(fakeKey);
      sandbox.stub(sync.$$super, '$initialize', function(model) {
        this.$$model = model;
      });
      model = {};
      model.$$emitter = {};
      model.$$emitter.emit = sandbox.stub();
      model.$$key = fakeKey;
    });

    describe('$initialize', function() {

      beforeEach(function() {
        sync.$initialize(model);
      });

      it('calls its super class\' $initialize', function() {
        sinon.assert.calledOnce(sync.$$super.$initialize);
      });

      it('registers room join and leave listeners', function() {
        sinon.assert.calledWith(
          fakeRoom.on, 'join',
          { local: true },
          sync.$$roomRegistry.join
        );

        sinon.assert.calledWith(
          fakeRoom.on, 'leave',
          { local: true },
          sync.$$roomRegistry.leave
        );
      });
    });

    describe('$handleJoin', function() {
      beforeEach(function() {
        sync.$initialize(model);
        sync.$$handleJoin(fakeUser);
      });

      it('adds the user to the model', function() {
        assert.equal(model[fakeUser.id], fakeUser);
      });

      it('emits the join event', function() {
        sinon.assert.calledOnce(model.$$emitter.emit);
        sinon.assert.calledWith(model.$$emitter.emit, 'join', fakeUser);
      });
    });

    describe('$handleLeave', function() {
      beforeEach(function() {
        sync.$initialize(model);
        sync.$$handleJoin(fakeUser);
        sync.$$handleLeave(fakeUser);
      });

      it('removes the user from the model', function() {
        assert.equal(model[fakeUser.id], undefined);
      });

      it('emits the leave event', function() {
        sinon.assert.calledTwice(model.$$emitter.emit);
        sinon.assert.calledWith(model.$$emitter.emit, 'leave', fakeUser);
      });
    });
  });

  function createFakeKey(name) {
    var fakeKey = {
      name: name,
      room: sinon.stub().returns(fakeRoom),
      set: sandbox.stub(),
      add: sandbox.stub(),
      remove: sandbox.stub(),
      on: sandbox.stub(),
      off: sandbox.stub(),
      get: sinon.stub().yields(null)
    };

    fakeKey.key = sinon.spy(function() { return fakeKey; });

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
});
