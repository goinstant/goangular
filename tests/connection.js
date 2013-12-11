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
  var url = 'url';
  var opts = { foo: 'bar' };

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

    describe('configuration', function() {

      it('extends the connection object with url and options', function() {
        var goConnection = new Connection();

        goConnection.set(url, opts);

        assert.equal(goConnection._opts, opts);
        assert.equal(goConnection._url, url);
        assert(goConnection._configured);
      });
    });

    describe('dependency injection', function() {
      var get, goConnection;

      beforeEach(function() {
        goConnection = new Connection();
        get = sandbox.stub().returns('connection');
        window.goinstant = {};
        window.goinstant.connect = sandbox.stub().returns({ get: get });
      });

      it('connects to goinstant', function() {
        goConnection.set(url, opts);
        goConnection.$get();

        assert(goConnection._connecting);
        assert.equal(goConnection._connection, 'connection');
        sinon.assert.calledWith(window.goinstant.connect, url, opts);
      });

      describe('error cases', function() {

        it('throws if goinstant is not availabe', function() {
          delete window.goinstant;
          goConnection.set(url, opts);

          assert.exception(function() {
            goConnection.$get();
          }, 'GoAngular requires the GoInstant library.');
        });

        it('throws if the connection has not been configured', function() {
          assert.exception(function() {
            goConnection.$get();
          }, 'The GoInstant connection must be configured first.');
        });
      });
    });
  });
});
