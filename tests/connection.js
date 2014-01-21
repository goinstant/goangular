/* jshint browser:true */

describe('GoAngular.goConnection', function() {

  'use strict';

  var require = window.require;
  var assert = window.assert;
  var sinon = window.sinon;

  /* Component Dependencies */
  var connectionFactory = require('goangular/lib/connection_factory');
  var Connection = require('goangular/lib/connection');

  var sandbox;
  var connection;
  var connect;
  var url = 'url';
  var opts = { user: 'bar' };

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  /* Angular interacts with the connection factory, connection.$get methods */
  describe('initialization', function() {

    it('instantiates Connection', function() {
      assert.instanceOf(connectionFactory(), Connection);
    });

    it('behaves like a singleton', function() {
      var connection1 = connectionFactory();
      var connection2 = connectionFactory();

      assert.equal(connection1, connection2);
    });

    describe('dependency injection', function() {
      var get, goConnection;

      beforeEach(function() {
        goConnection = new Connection();
        get = sandbox.stub().returns('connection');
        connection = {
          room: sinon.stub().returns(connection),
          key: sinon.stub().returns(connection)
        };
        connect = sandbox.stub().returns(connection);

        window.goinstant = {};
        window.goinstant.Connection = sandbox.stub().returns({
          get: get,
          connect: connect
        });
      });

      it('extends the connection object with url and options', function() {
        var goConnection = new Connection();

        goConnection.$set(url, opts);

        assert.equal(goConnection.$$opts, opts);
        assert.equal(goConnection.$$url, url);
        assert(goConnection.$$configured);
      });

      it('connects to goinstant', function() {
        goConnection.$set(url, opts);
        goConnection.$get();

        sinon.assert.calledWith(connect, opts.user);
      });

      describe('error cases', function() {

        it('throws if goinstant is not available', function() {
          window.goinstant = null;

          assert.exception(function() {
            goConnection.$set(url, opts);
          }, 'GoAngular requires the GoInstant library.');
        });

        it('throws if the connection has not been configured', function() {
          assert.exception(function() {
            goConnection.$ready();
          }, /You must configure you connection first/);
        });
      });
    });
  });
});
