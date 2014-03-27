/* jshint browser:true */
/* global require */

describe('GoAngular.goConnection', function() {

  'use strict';

  var assert = require('gi-assert');
  var sinon = require('sinon');
  var _ = require('lodash');

  /* Component Dependencies */
  var connectionFactory = require('../lib/connection_factory');
  var Connection = require('../lib/connection');

  var sandbox;
  var connection;
  var connect;
  var connectionObj;
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
          room: sandbox.stub().returns(connection),
          key: sandbox.stub().returns(connection)
        };
        connect = sandbox.stub().returns(connection).yields();
        connectionObj = {
          get: get,
          connect: connect,
          isGuest: sandbox.stub().returns(null),
          loginUrl: sandbox.stub(),
          logoutUrl: sandbox.stub()
        };

        window.goinstant = {};
        window.goinstant.Connection = sandbox.stub().returns(connectionObj);
      });

      it('extends the connection object with url and options', function() {
        var goConnection = new Connection();

        goConnection.$set(url, opts);

        assert.equal(goConnection.$$opts, opts);
        assert.equal(goConnection.$$url, url);
        assert.equal(goConnection.$$configured, true);
      });

      it('connects to goinstant', function() {
        goConnection.$set(url, opts);
        goConnection.$get();

        sinon.assert.calledWith(connect, opts.user);
      });

      describe('auth', function() {
        var conn;

        beforeEach(function() {
          conn = connectionFactory();
          conn.$set(url);
          conn.$$connect();
        });

        describe('isGuest', function() {
          it('calls connectionObj#isGuest', function() {
            sinon.assert.calledOnce(connectionObj.isGuest);
            assert.isNull(conn.isGuest, null);
          });
        });

        describe('$loginUrl', function() {
          it('calls connectionObj#loginUrl', function() {
            var fakeReturnTo = 'http://localhost:1234';

            conn.$loginUrl(null, fakeReturnTo);

            sinon.assert.calledOnce(connectionObj.loginUrl);
            sinon.assert.calledWith(connectionObj.loginUrl, null, fakeReturnTo);
          });

          it('accepts an array of providers', function() {
            var myProviders = ['Google', 'Salesforce', 'Twitter'];
            conn.$loginUrl(myProviders);

            sinon.assert.calledThrice(connectionObj.loginUrl);
            sinon.assert.calledWith(connectionObj.loginUrl, 'google');
            sinon.assert.calledWith(connectionObj.loginUrl, 'forcedotcom');
            sinon.assert.calledWith(connectionObj.loginUrl, 'twitter');
          });

          it('accepts a string param', function() {
            var myProviders = ['GitHub', 'Twitter', 'Salesforce'];

            _.each(myProviders, function(provider) {
              conn.$loginUrl(provider);
            });

            sinon.assert.calledThrice(connectionObj.loginUrl);
            sinon.assert.calledWith(connectionObj.loginUrl, 'github');
            sinon.assert.calledWith(connectionObj.loginUrl, 'twitter');
            sinon.assert.calledWith(connectionObj.loginUrl, 'forcedotcom');
          });
        });

        describe('$logoutUrl', function() {
          it('calls connectionObj#logoutUrl', function() {
            conn.$logoutUrl();

            sinon.assert.calledOnce(connectionObj.logoutUrl);
          });

          it('accepts a returnTo URL', function() {
            var fakeReturnTo = 'http://localhost:1234';

            conn.$logoutUrl(fakeReturnTo);

            sinon.assert.calledWith(connectionObj.logoutUrl, fakeReturnTo);
          });
        });
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
