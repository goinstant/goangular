/* jshint browser:true */
/* global require */

describe('GoAngular.querySync', function() {

  'use strict';

  var _ = require('lodash');
  var assert = require('gi-assert');
  var sinon = require('sinon');

  var querySync = require('../lib/query_sync');

  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('initialization', function() {
    var $parse;
    var $timeout;
    var query;
    var result;
    var factory;
    var sync;
    var model;

    beforeEach(function() {
      $parse = sandbox.stub();
      $timeout = sandbox.stub().callsArg(0);

      query = createFakeQuery();
      result = [];
      factory = querySync($parse, $timeout);
      sync = factory(query);
      model = {
        $$index: [],
        $$emitter: { emit: sinon.stub() }
      };
    });

    describe('$initialize', function() {

      beforeEach(function() {
        sync.$initialize(model);
      });

      it('executes query & registers listeners', function() {
        var listener = sinon.match.func;

        _.map(['add', 'update', 'remove'], function(e) {
          sinon.assert.calledWith(query.on, e, listener);
        });

        sinon.assert.calledOnce(query.execute);
      });

      it('extends the model with the result set', function() {
        query.execute = sinon.stub().yields(null, result);
        factory(query).$initialize(model);

        assert.deepEqual(model, _.merge(model, result));
      });
    });

    describe('$$handleUpdate', function() {
      var positionDefault = { position: { current: 0 } };
      var queryUpdateData = [
        {
          model: { foo: 'bar', $$index: ['foo'] },
          desc: 'model is prepended with a new result',
          result: { name: 'bar', value: 'foo'},
          context: positionDefault,
          expect: { foo: 'bar', bar: 'foo'}
        },
        {
          model: { foo: 'bar', $$index: ['foo'] },
          desc: 'model is appended with a new result',
          result: { name: 'bar', value: 'foo'},
          context: { position: { current: 1 } },
          expect: { foo: 'bar', bar: 'foo'}
        },
        {
          model: { foo: 'bar', $$index: ['foo'] },
          desc: 'exisiting result is updated with a new value',
          result: { name: 'foo', value: 'zoo'},
          context: positionDefault,
          expect: { foo: 'zoo' }
        },
        {
          model: { foo: 'bar', bar: 'foo', $$index: ['foo', 'bar'] },
          desc: 'exisiting result is updated with a new position',
          result: { name: 'foo', value: 'bar'},
          context: { position: { current: 1 } },
          expect: { foo: 'bar', bar: 'foo'}
        }
      ];

      _.each(queryUpdateData, function(data) {
        it(data.desc, function() {
          sync.$$model = _.merge(model, data.model);
          sync.$$handleUpdate(data.result, data.context);

          var position = data.context.position.current;

          assert.sameMembers(sync.$$model, data.expect);
          assert.equal(sync.$$model.$$index[position], data.result.name);
        });
      });
    });

    describe('$$handleRemove', function() {

      it('removes a result from the appropriate index', function() {
        var context = { position: { previous: 0 } };
        var result = { name: 'foo' };

        sync.$$model = _.merge(model, { foo: 'bar' });
        sync.$$handleRemove(result, context);

        var expect = _.merge(model, result);

        assert.sameMembers(sync.$$model, expect);
        assert.equal(sync.$$model.$$index.length, 0);
      });
    });
  });

  function createFakeQuery(name) {
    var fakeQuery = {
      name: name,
      execute: sandbox.stub().yields(null, 1),
      set: sandbox.stub(),
      remove: sandbox.stub(),
      on: sandbox.stub(),
      off: sandbox.stub()
    };

    fakeQuery.key = sinon.spy(function() { return fakeQuery; });

    return fakeQuery;
  }
});
