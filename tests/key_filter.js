/* jshint browser:true */
/* global require */

describe('GoAngular.keyFilter', function() {
  'use strict';

  var _ = require('lodash');
  var assert = require('gi-assert');
  var sinon = require('sinon');

  /* Component Dependencies */
  var keyFilter = require('../lib/key_filter');

  var sandbox;
  var testFilter;
  var modelData;
  var mockModel;
  var mockPrimModel;
  var mockQueryModel;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    modelData = {
      id1: {
        desc: 'abc'
      },
      id2: {
        desc: '123'
      }
    };

    mockModel = _.cloneDeep(modelData);
    mockModel.$$index = [];
    mockModel.$omit = sandbox.stub().returns(modelData);

    mockPrimModel = { foo: 123, bar: 'abc', $$index: [] };
    mockQueryModel = _.cloneDeep(mockModel);
    mockQueryModel.$$index = ['id2', 'id1'];

    testFilter = keyFilter();
  });

  afterEach(function() {
    sandbox.restore();
    mockModel = null;
    mockPrimModel = null;
    mockQueryModel = null;
    testFilter = null;
  });

  describe('filter params', function() {
    it('returns what was passed if falsey', function() {
      var result = testFilter(undefined);
      assert.isUndefined(result);
    });

    it('returns what was passed if not an object', function() {
      var fakeInput = [123, 456, 789];

      var result = testFilter(fakeInput);
      assert.equal(result, fakeInput);
    });

    it('returns what was passed if enabled is false', function() {
      var result = testFilter(mockModel, false);
      assert.deepEqual(result, mockModel);
    });

    it('filters the input if enabled is true', function() {
      var result = testFilter(mockModel, true);

      assert.equal(result.length, 2);
    });
  });

  describe('output', function() {
    it('orders a query model based on $$index', function() {
      var result = testFilter(mockQueryModel);
      var indices = mockQueryModel.$$index;

      assert.equal(indices.length, result.length);

      _.each(indices, function(key, index) {
        assert.equal(key, result[index].$name);
        assert.equal(modelData[key].desc, result[index].desc);
      });
    });

    it('converts a plain object to an array', function() {
      var fakeObj = {
        foo: '123',
        bar: 'abc'
      };

      var result = testFilter(fakeObj);

      assert.equal(result.length, _.keys(fakeObj).length);

      _.each(result, function(value) {
        assert.equal(fakeObj[value.$name], value.$value);
      });
    });

    it('uses cached model if primitive is unchanged', function() {
      var fakeObj = {
        foo: '123',
        bar: true,
        baz: 765
      };

      var result = testFilter(fakeObj);
      var result2 = testFilter(fakeObj);

      _.each(result, function(value, index) {
        assert.isTrue(value === result2[index]);
      });
    });

    it('creates a new model if primitive value changes', function() {
      var fakeObj = {
        foo: '123',
        bar: true,
        baz: 765
      };

      var result = testFilter(fakeObj);

      fakeObj.bar = false;
      var result2 = testFilter(fakeObj);
      var result3 = testFilter(fakeObj);

      _.each(result, function(value, index) {
        if (value.$name === 'bar') {
          assert.isFalse(value === result2[index]);

          return;
        }

        assert.isTrue(value === result2[index]);
        assert.isTrue(result2[index] === result3[index]);
      });
    });

    it('handles a collection of arrays', function() {
      var fakeCollect = {
        id1: [ 1, 2, 3],
        id2: [ 2, 3, 4, 5]
      };

      var result = testFilter(fakeCollect);
      var index = 0;

      _.each(fakeCollect, function(item, key) {
        assert.equal(result[index].length, fakeCollect[key].length);
        assert.equal(result[index].$name, key);
        assert.equal(_.difference(result[index], fakeCollect[key]).length, 0);

        index++;
      });
    });
  });
});