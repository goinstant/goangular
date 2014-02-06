/* jshint browser:true */

describe('GoAngular.Model', function() {

  'use strict';

  var require = window.require;
  var assert = window.assert;
  var sinon = window.sinon;

  /* Component Dependencies */
  var Model = require('goangular/lib/model');
  var errors = require('goangular/lib/errors').errorMap;

  var sandbox;
  var fakeKey;
  var fakeSync;
  var fakeConn;
  var fakePromise;
  var initialize;

  before(function() {
    sandbox = sinon.sandbox.create();
    fakeKey = createFakeKey();

    fakePromise = {
      then: function(cb) { cb(); return fakePromise; },
      fail: sandbox.stub()
    };

    initialize = sandbox.stub();

    fakeConn = { $ready: sinon.stub().returns(fakePromise) };
    fakeSync = {
      $initialize: initialize
    };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('initialization', function() {
    var model;

    beforeEach(function() {
      model = new Model(fakeConn, fakeKey, fakeSync);
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

        sinon.assert.calledWith(fakeKey.key, 'keyName');
      });
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

      it('add an event listener', function() {
        model.$on('eventName', 'listener');

        sinon.assert.calledWith(fakeKey.on, 'eventName', 'listener');
      });
    });

    describe('$off', function() {

      it('add an event listener', function() {
        model.$off('eventName', 'listener');

        sinon.assert.calledWith(fakeKey.off, 'eventName', 'listener');
      });
    });

    describe('$omit', function() {

      it('returns an object sans $-prefixed properties', function() {
        var result = model.$omit();

        assert.deepEqual(result, {});
      });
    });
  });

  function createFakeKey(name) {
    var fakeKey = {
      name: name,
      set: sandbox.stub(),
      add: sandbox.stub(),
      remove: sandbox.stub(),
      on: sandbox.stub(),
      off: sandbox.stub()
    };

    fakeKey.key = sinon.spy(function() { return fakeKey; });

    return fakeKey;
  }
});
