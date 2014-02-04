/* jshint browser:true */

describe('GoAngular.goKey', function() {

  'use strict';

  var require = window.require;
  var assert = window.assert;
  var sinon = window.sinon;

  /* Component Dependencies */
  var Model = require('goangular/lib/model');
  var keyFactory = require('goangular/lib/key_factory');

  var errors = require('goangular/lib/errors').errorMap;

  var sandbox;
  var fakeKey;
  var $goSync;
  var $goConnection;
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

    $goConnection = { $ready: sinon.stub().returns(fakePromise) };
    $goSync = sandbox.stub().returns({
      $initialize: initialize
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('initialization', function() {
    var model;

    beforeEach(function() {
      model = keyFactory($goSync, $goConnection)(fakeKey);
    });

    it('returns a new instance', function() {
      assert.instanceOf(model, Model);
    });

    describe('$sync', function() {

      it('delegates synchronization to goSync', function() {
        model.$sync();

        sinon.assert.calledWith($goSync, fakeKey, model);
        sinon.assert.calledOnce(initialize);
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
        var fakeLstner = sinon.stub();

        model.$on('eventName', fakeLstner);

        sinon.assert.calledWith(fakeKey.on, 'eventName', fakeLstner);
      });

      it('add an event listener with options object', function() {
        var fakeOpts = {
          local: true
        };

        var fakeLstner = sinon.stub();

        model.$on('eventName', fakeOpts, fakeLstner);

        sinon.assert.calledWith(fakeKey.on, 'eventName', fakeOpts, fakeLstner);
      });
    });

    describe('$off', function() {

      it('remove an event listener', function() {
        var fakeLstner = sinon.stub();

        model.$off('eventName', fakeLstner);

        sinon.assert.calledWith(fakeKey.off, 'eventName', fakeLstner);
      });

      it('remove an event listener with options object', function() {
        var fakeOpts = {
          bubble: true
        };

        var fakeLstner = sinon.stub();

        model.$off('eventName', fakeOpts, fakeLstner);

        sinon.assert.calledWith(fakeKey.off, 'eventName', fakeOpts, fakeLstner);
      });
    });

    describe('error cases', function() {

      it('throws if a key is not provided', function() {
        assert.exception(function() {
          var factory = keyFactory($goSync, $goConnection);
          factory();
        }, '$goKey' + errors.INVALID_ARGUMENT);
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