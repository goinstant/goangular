/* jshint browser:true */
/* global require */

'use strict';

var _ = require('lodash');
var assert = require('gi-assert');
var sinon = require('sinon');

var Channel = require('../lib/channel').constructor;

describe('GoAngular.Channel', function() {

  var sandbox;
  var fakeChan;
  var fakeConn;
  var fakePromise;

  before(function() {
    sandbox = sinon.sandbox.create();
    fakeConn = { $ready: function() { return fakePromise } };
    fakeChan = {
      message: sandbox.stub(),
      equals: sandbox.stub(),
      on: sandbox.stub(),
      off: sandbox.stub(),
      room: sandbox.stub()
    };
    fakePromise = {
      then: sinon.stub().yields(),
      fail: sandbox.stub()
    };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('initialization', function() {
    var channel;

    beforeEach(function() {
      channel = new Channel(fakeConn, fakeChan);
    });

    it('creates a new channel instance', function() {
      assert.instanceOf(channel, Channel);
    });

    describe('method delegation', function() {

      it('publishes a message post connection', function() {
        channel.$message('foo');

        sinon.assert.calledOnce(fakePromise.then);
        sinon.assert.calledOnce(fakeChan.message);
      });

      _(['equals', 'on', 'off', 'room']).each(function(m) {
        it('delegates to channel.equals', function() {
          channel['$'+m]({ $$chan: fakeChan });

          sinon.assert.calledOnce(fakeChan[m]);
        });
      });
    });

  });

});
