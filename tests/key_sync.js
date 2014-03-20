/* jshint browser:true */

describe('GoAngular.keySync', function() {

  'use strict';

  var _ = require('lodash');
  var assert = require('gi-assert');
  var sinon = require('sinon');

  /* Component Dependencies */
  var keySync = require('../lib/key_sync');

  var sandbox;
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
    fakeKey = createFakeKey();
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
      model = {};
      model.$$emitter = {};
      model.$$emitter.emit = sinon.stub();
      model.$$key = fakeKey;
    });

    describe('$initialize', function() {

      beforeEach(function() {
        sync.$initialize(model);
      });

      it('retrieves the current value', function() {
        sinon.assert.calledOnce(fakeKey.get);
      });

      it('assigns a primitive number to model.$value', function() {
        fakeKey.get = sinon.stub().yields(null, primitiveInt);
        factory(fakeKey).$initialize(model);

        assert.equal(model.$value, primitiveInt);
      });

      it('assigns a primitive string to model.$value', function() {
        fakeKey.get = sinon.stub().yields(null, primitiveStr);
        factory(fakeKey).$initialize(model);

        assert.equal(model.$value, primitiveStr);
      });

      it('assigns a primitive bool to model.$value', function() {
        fakeKey.get = sinon.stub().yields(null, primitiveBool);
        factory(fakeKey).$initialize(model);

        assert.equal(model.$value, primitiveBool);
      });

      it('extends the model if an object is returned', function() {
        fakeKey.get = sinon.stub().yields(null, collection);
        factory(fakeKey).$initialize(model);

        assert.deepEqual(model, _.merge(_.cloneDeep(model), collection));
      });

      it('extends the model if an array is returned', function() {
        fakeKey.get = sinon.stub().yields(null, list);
        factory(fakeKey).$initialize(model);

        var obj = {};
        _.each(list, function(value, key) {
          obj[key] = value;
        });

        assert.deepEqual(model, _.merge(_.cloneDeep(model), obj));
      });

      it('uses the model key when performing the initial #get', function() {
        var fakeChildKey = createFakeKey('childKey');
        var fakeCollection2 = {
          childFoo: 'childFoo',
          childBar: 'childBar'
        };

        fakeChildKey.get = sinon.stub().yields(null, fakeCollection2);
        model.$$key = fakeChildKey;
        factory(fakeKey).$initialize(model);
        assert.deepEqual(model, _.merge(_.cloneDeep(model), fakeCollection2));
      });

      it('returns a model', function() {
        var listenerOpts = {
          local: true,
          bubble: true,
          listener: sinon.match.func
        };

        _.map(['add', 'set', 'remove'], function(e) {
          sinon.assert.calledWith(fakeKey.on, e, listenerOpts);
        });
      });
    });

    describe('$$handleUpdate', function() {
      var model = { $$emitter: {} };
      var keyUpdateData = [
        {
          desc: 'updates the models primitive value for int',
          value: 5,
          context: { key: '/currentKey', currentKey: '/currentKey' },
          expect: _.merge(_.cloneDeep(model), { $value: 5 })
        },
        {
          desc: 'updates the models primitive value for string',
          value: 'foo',
          context: { key: '/currentKey', currentKey: '/currentKey' },
          expect: _.merge(_.cloneDeep(model), { $value: 'foo' })
        },
        {
          desc: 'updates the models primitive value for boolean',
          value: false,
          context: { key: '/currentKey', currentKey: '/currentKey' },
          expect: _.merge(_.cloneDeep(model), { $value: false })
        },
        {
          desc: 'updates the model with object',
          value: { foo: 'bar' },
          context: { key: '/currentKey', currentKey: '/currentKey' },
          expect: _.merge(_.cloneDeep(model), { foo: 'bar' })
        },
        {
          desc: 'updates the model with Array',
          value: ['foo', 'bar'],
          context: { key: '/currentKey', currentKey: '/currentKey' },
          expect: _.merge(_.cloneDeep(model), { 0: 'foo', 1: 'bar' })
        },
        {
          desc: 'replaces the models value on set',
          model: { foo: 'bar' },
          value: { bar: 'foo' },
          context: {
            command: 'SET',
            key: '/currentKey',
            currentKey: '/currentKey'
          },
          expect: { bar: 'foo' }
        },
        {
          desc: 'clears dead branches on set',
          model: { foo: { bar: 'foo', ding: 'dong' } },
          value: { bar: { bar: 'foo' } },
          context: {
            command: 'SET',
            key: '/currentKey',
            currentKey: '/currentKey'
          },
          expect: { bar: { bar: 'foo' } }
        },
        {
          desc: 'will add a child primitive',
          value: 'bar',
          context: {
            currentKey: '/currentKey',
            command: 'ADD',
            addedKey: '/currentKey/foo'
          },
          expect: _.merge(_.cloneDeep(model), { foo: 'bar' })
        },
        {
          desc: 'will merge changes into an exisiting model',
          model: { foo: 'bar' },
          value: 'foo',
          context: {
            currentKey: '/currentKey',
            command: 'ADD',
            addedKey: '/currentKey/bar'
          },
          expect: { foo: 'bar', bar: 'foo' }
        },
        {
          desc: 'will merge nested changes into an exisiting model',
          model: { foo: 'bar' },
          value: { ding: 'dong' },
          context: {
            currentKey: '/currentKey',
            command: 'ADD',
            addedKey: '/currentKey/bar'
          },
          expect: { foo: 'bar', bar: { ding: 'dong' } }
        },
        {
          desc: 'will convert a primitive to a collection',
          model: { $value: 'foo' },
          value: 'bar',
          context: {
            currentKey: '/currentKey',
            command: 'ADD',
            addedKey: '/currentKey/foo'
          },
          expect: { foo: 'bar' }
        }
      ];

      _.each(keyUpdateData, function(data) {
        it(data.desc, function() {
          sync.$$model = _.clone(data.model) || _.clone(model);
          sync.$$handleUpdate(data.value, data.context);

          assert.deepEqual(sync.$$model, data.expect);
        });
      });
    });

    describe('$$handleRemove', function() {
      var keyUpdateData = [
        {
          desc: 'removes relative key',
          model: { bar: 'foo', foo: 'bar' },
          context: { key: '/currentKey/foo', currentKey: '/currentKey' },
          expect: { bar: 'foo' }
        },
        {
          desc: 'destroys the current key removes listeners',
          model: { $value: 'ding' },
          context: { key: '/currentKey', currentKey: '/currentKey' },
          expect: {}
        },
        {
          desc: 'collapses dead branches',
          model: { foo: { bar: 'foo' }, ding: 'dong' },
          context: { key: '/currentKey/foo/bar', currentKey: '/currentKey' },
          expect: { ding: 'dong' }
        }
      ];

      _.each(keyUpdateData, function(data) {
        it(data.desc, function() {
          sync.$initialize(model);
          sync.$$model = _.clone(data.model);
          sync.$$handleRemove(data.value, data.context);

          if (data.context.key === data.context.currentKey) {
            _.map(['add', 'set', 'remove'], function(e) {
              sinon.assert.calledWith(fakeKey.off, e, sinon.match.func);
            });
          }

          assert.deepEqual(sync.$$model, data.expect);
        });
      });
    });
  });

  function createFakeKey(name) {
    var fakeKey = {
      name: name,
      get: sandbox.stub().yields(null, 1),
      set: sandbox.stub(),
      remove: sandbox.stub(),
      on: sandbox.stub(),
      off: sandbox.stub()
    };

    fakeKey.key = sinon.spy(function() { return fakeKey; });

    return fakeKey;
  }
});
