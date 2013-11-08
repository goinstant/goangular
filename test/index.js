/* jshint browser:true */

describe('GoAngular Component', function() {

  'use strict';

  var require = window.require;
  var assert = window.assert;
  var sinon = window.sinon;

  var _ = require('lodash');
  var errors = require('goangular/lib/errors').errorMap;
  var goAngularFactory = require('goangular/lib/go_angular_factory');
  var GoAngular = require('goangular/lib/go_angular');
  var ScopeScrubber = require('goangular/lib/scope_scrubber');
  var ModelBinder = require('goangular/lib/model_binder');
  var goConnect = require('goangular/lib/go_connect');

  var platform;
  var deferred;
  var dependencies;
  var scopeFake;
  var room;
  var promise;
  var parse;
  var model;
  var result;

  var sandbox;
  var fakeKey;

  beforeEach(function() {

    sandbox = sinon.sandbox.create();


    scopeFake = {
      foo: 'bar',
      $apply: sandbox.stub().callsArg(0),
      $watch: sandbox.spy()
    };

    room = sandbox.stub();
    room.returns(room);
    room.key = sandbox.stub();
    fakeKey = createFakeKey();
    room.key.returns(fakeKey);
    room.join = sandbox.stub().callsArg(0);

    promise = {
      resolve: sandbox.spy(),
      promise: sandbox.spy(),
      reject: sandbox.spy()
    };

    deferred = { defer: sandbox.stub() };
    deferred.defer.returns(promise);

    model = {
      name: 'foo',
      value: 'bar',
      set: sandbox.stub()
    };

    model.get = sandbox.stub().returns(model.value);

    parse = function(modelName) {
      var name = modelName;

      var modelfunc = function(scope) {
        return scope[name];
      };

      modelfunc.assign = function(scope, value) {
        scope[modelName] = value;
      };

      return modelfunc;
    };

    dependencies = [deferred];

    platform = {
      room: room,
      connect: sandbox.stub().callsArg(1)
    };

    result = {
      rooms: {
        lobby: room,
        foo: room
      },
      platform: platform
    };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('goAngularFactory', function() {
    var opts, namespace, scope, instance, factory;

    beforeEach(function() {
      // Simulate dependency injection
      factory = goAngularFactory(deferred, parse, platform);

      scope = scopeFake;
      namespace = 'bar';
      opts = { room: 'foo' };
    });

    it('Returns a goAngular instance', function() {
      assert.noException(function() {
        instance = factory(scope, namespace, opts);
      });

      assert.instanceOf(instance, GoAngular);
    });

    describe('Error Cases', function() {
      var errorCases = {
        'invalid options': {
          opts: 'foo',
          errorType: 'INVALID_OPTIONS'
        },
        'invalid argument': {
          opts: { foo: 'bar'},
          errorType: 'INVALID_ARGUMENT'
        },
        'invalid scope': {
          scope: 'foo',
          errorType: 'INVALID_SCOPE'
        },
        'invalid room name': {
          opts: { room: ['foo', 'bar'] },
          errorType: 'INVALID_ROOM'
        },
        'invalid key name': {
          namespace: ['foo', 'var'],
          errorType: 'INVALID_KEY'
        },
        'invalid include': {
          opts: { include: 'foo' },
          errorType: 'INVALID_INCLUDE'
        },
        'invalid exclude': {
          opts: { exclude: 'foo' },
          errorType: 'INVALID_EXCLUDE'
        }
      };

      _.each(errorCases, function(errCase, errDesc) {
        it('throws if passed ' + errDesc, function() {
          var scopeTest = errCase.scope || scope;
          var namespaceTest = errCase.namespace || namespace;
          var optsTest = errCase.opts || opts;

          assert.exception(function() {
            instance = factory(scopeTest, namespaceTest, optsTest);
          }, 'goAngularFactory' + errors[errCase.errorType]);
        });
      });
    });
  });

  describe('GoAngular', function() {
    var opts, namespace, scope, goAngular;

    beforeEach(function() {
      scope = scopeFake;
      namespace = 'bar';
      opts = { room: 'foo' };
    });

    describe('#constructor', function() {

      it('creates a deferred object, returns an instance', function() {
        assert.noException(function() {
          goAngular = new GoAngular(
            scope, namespace, opts, deferred, parse, platform
          );
        });

        assert.instanceOf(goAngular, GoAngular);
        assert(deferred.defer.calledOnce);
      });

    });

    describe('#initialize', function() {

      beforeEach(function() {
         platform.then = sandbox.stub().callsArgWith(0, result);
      });

      it('resolves the deferred on a succesful initalization', function() {
        goAngular = new GoAngular(
            scope, namespace, opts, deferred, parse, platform
        );

        goAngular.initialize();
        assert(promise.resolve.calledOnce);
      });

      it('rejects the deferred on a failed platform connection', function() {
        promise.reject = sandbox.stub();
        platform.then = sandbox.stub().callsArgWith(1);

        goAngular = new GoAngular(
            scope, namespace, opts, deferred, parse, platform
        );

        goAngular.initialize();
        assert(promise.reject.calledOnce);
      });

      it('creates a platform key', function() {
        opts.room = 'foo';

        goAngular = new GoAngular(
            scope, namespace, opts, deferred, parse, platform
        );

        goAngular.initialize();

        assert(room.key.calledWith('goinstant/integrations/go-angular'));
        assert(fakeKey.key.calledWith('bar'));
      });

      it('creates a new instance of ScopeScrubber', function() {
        goAngular = new GoAngular(
            scope, namespace, opts, deferred, parse, platform
        );

        goAngular.initialize();
        assert.instanceOf(goAngular._scopeScrubber, ScopeScrubber);
      });

      it('begins monitoring scope', function() {
        goAngular = new GoAngular(
            scope, namespace, opts, deferred, parse, platform
        );

        goAngular._monitorScope = sandbox.stub();
        goAngular.initialize();
        assert(goAngular._monitorScope.calledOnce);
      });

      it('creates a new instance of ModelBinder', function() {
        goAngular = new GoAngular(
            scope, namespace, opts, deferred, parse, platform
        );

        goAngular.initialize();
        assert.instanceOf(goAngular._modelBinder, ModelBinder);
      });
    });

    describe('#_monitorScope', function() {

      beforeEach(function() {
        platform.then = sandbox.stub().callsArgWith(0, platform);
      });

      it('begins $watch[ing] scope', function() {
        goAngular = new GoAngular(
            scope, namespace, opts, deferred, parse, platform
        );

        goAngular._monitorScope();
        assert(scopeFake.$watch.calledWith(goAngular._handleScopeChanges));
      });
    });

    describe('#_handleScopeChanges', function() {

      beforeEach(function() {
        platform.then = sandbox.stub().callsArgWith(0, result);
      });

      it('only binds new models', function(done) {
        goAngular = new GoAngular(
            scope, namespace, opts, deferred, parse, platform
        );

        goAngular.initialize();
        goAngular._scope = { bar: 'foo' };
        goAngular._handleScopeChanges();

        goAngular._modelBinder.newBinding = function(modelKey, cb) {
          assert.equal(modelKey, 'bar');
          cb();
          done();
        };
      });
    });

    describe('#destroy', function() {

      beforeEach(function() {
        platform.then = sandbox.stub().callsArgWith(0, result);
      });

      it('begins cleanup when invoked', function() {
        goAngular = new GoAngular(
            scope, namespace, opts, deferred, parse, platform
        );

        goAngular.initialize();
        goAngular._modelBinder.cleanup = sandbox.stub();

        var cb = sandbox.stub().yields();

        goAngular.destroy(cb);
        assert(goAngular._modelBinder.cleanup.calledWith(cb));
      });

      describe('Throws', function() {

        it('throws if passed an invalid callback', function() {
          goAngular = new GoAngular(
              scope, namespace, opts, deferred, parse, platform
          );

          goAngular.initialize();
          assert.exception(function() {
            goAngular.destroy();
          }, 'GoAngular' + errors.INVALID_CALLBACK);
        });
      });
    });
  });

  describe('goConnect', function() {
    var opts, url, instance, provider, $get;

    beforeEach(function() {
      // Simulate dependency injection
      provider = goConnect();
      $get = _.last(provider.$get);
      opts = { rooms: ['foo'] };
      url = 'bar';
    });

    describe('goConnect: Error Cases', function() {

      var errorCases = {
        'invalid options': {
          opts: 'foo',
          errorType: 'INVALID_OPTIONS'
        },
        'invalid argument': {
          opts: { key: 'foo', value: 'bar' },
          errorType: 'INVALID_ARGUMENT'
        },
        'invalid room': {
          opts: { key: 'rooms', value: { foo: 'bar' } },
          errorType: 'INVALID_ROOM'
        },
        'invalid url': {
          url: ['foo'],
          errorType: 'INVALID_URL'
        },
        'invalid user token': {
          opts: { key: 'user', value: ['foo'] },
          errorType: 'INVALID_TOKEN'
        }
      };

       _.each(errorCases, function(errCase, errDesc) {
        it('throws if passed ' + errDesc, function() {

          url = errCase.url || url;

          if (errCase.opts && errCase.opts.key) {
            opts[errCase.opts.key] = errCase.opts.value;
          } else {
            opts = errCase.opts || opts;
          }


          assert.exception(function() {
            instance = provider.set(url, opts);
          }, 'goConnect' + errors[errCase.errorType]);
        });
      });
    });

    describe('goConnect: $get', function() {

      beforeEach(function() {
        provider.set(url, opts);

        window.goinstant = {};
        window.goinstant.Platform = sandbox.stub();
        window.goinstant.Platform.returns(platform);
        window.goinstant.connect = sandbox.stub().yields().callsArg(2);
      });

      it('connects to GoInstant', function() {
        $get(deferred, scopeFake);

        assert(window.goinstant.connect.called);
      });

      it('creates and returns a new deferred', function() {
        var p = $get(deferred, scopeFake);

        assert(deferred.defer.called);
        assert.equal(p, promise.promise);
      });

      it('resolves the deferred on a successfull connection', function() {
        $get(deferred, scopeFake);

        assert(promise.resolve.called);
      });

      _.each(['rooms', 'token'],function(opt) {
        it('does not pass the rooms key if it is not in the opts', function() {
          delete opts.rooms;

          $get(deferred, scopeFake);

          var optsPassedToConnect = window.goinstant.connect.args[0][0];

          assert.isFalse(_.has(optsPassedToConnect, opt));
        });
      });
    });
  });

  describe('ModelBinder', function() {
    var _key, modelBinder;

    describe('Constructor', function() {

      it('creates and returns a new instance', function() {
        var _key = createFakeKey('fakeKey');

        assert.noException(function() {
          modelBinder = new ModelBinder(scopeFake, parse, _key);
        });

        assert.instanceOf(modelBinder, ModelBinder);
      });

    });

    describe('#newBinding', function() {

      beforeEach(function() {
        _key = createFakeKey('foo');

        modelBinder = new ModelBinder(scopeFake, parse, _key);
      });

      it('triggers firstFetch, localMonitor & remoteMonitor', function(done) {
        modelBinder._firstFetch = sandbox.stub().callsArg(1);
        modelBinder._localMonitor = sandbox.stub().callsArg(1);
        modelBinder._remoteMonitor = sandbox.stub().callsArg(1);

        modelBinder.newBinding('bar', function(err) {
          assert.equal(err, null);
          assert(modelBinder._firstFetch.called);
          assert(modelBinder._localMonitor.called);
          assert(modelBinder._remoteMonitor.called);
          done();
        });
      });

      it('will accept a valid default', function(done) {
        scopeFake.bar = 'validDefault';

        modelBinder.newBinding('bar');
        assert(_key.set.calledWith('validDefault'));
        done();
      });

      it('will not set a key for an invalid default', function(done) {
        scopeFake.bar = undefined;

        modelBinder.newBinding('bar');
        assert(_key.set.notCalled);
        done();
      });
    });

    describe('#_firstFetch', function() {

      beforeEach(function() {
        _key = createFakeKey('foo');

        modelBinder = new ModelBinder(scopeFake, parse, _key);
      });

      it('gets the current value of a model', function(done) {
        modelBinder._firstFetch(model, function() {
          assert(_key.get.called);
          done();
        });
      });

      it('callsback with an error if get fails', function(done) {
        var err = new Error('fake Error');
        _key.get = sandbox.stub().callsArgWith(0, err);

        modelBinder._firstFetch(model, function(error) {
          assert.equal(error, err);
          done();
        });
      });

      it('sets the value if null is returned from get', function(done) {
        scopeFake[model.name] = model.value;
        _key.get = sandbox.stub().callsArgWith(0, null, null);

        modelBinder._firstFetch(model, function(err) {
          assert.equal(err, null);
          assert(_key.set.calledWith(model.value));
          done();
        });
      });

      it('updates the model in scope if a value is returned', function(done) {
        _key.get = sandbox.stub().callsArgWith(0, null, 'aValue');

        modelBinder._firstFetch(model, function(err) {
          assert.equal(err, null);
          assert.equal(scopeFake[model.name], model.value);
          done();
        });
      });

    });

    describe('#_localMonitor', function() {

      beforeEach(function() {
        _key = createFakeKey('foo');
        modelBinder = new ModelBinder(scopeFake, parse, _key);
      });

      it('begins watching local models', function(done) {
        modelBinder._localMonitor(model.name, function(err) {
          assert.equal(err, null);
          assert(scopeFake.$watch.called);
          done();
        });
      });

    });

    describe('#_remoteMonitor', function() {
      var modelName;

      beforeEach(function() {
        _key = createFakeKey('foo');
        modelName = 'bar';
        modelBinder = new ModelBinder(scopeFake, parse, _key);
      });

      it('adds a new key listener', function(done) {
        modelBinder._remoteMonitor(modelName, function(err) {
          assert.equal(err, null);
          assert(_key.on.calledWith('set', {
            bubble: true,
            listener: modelBinder._keySetHandler
          }));
          done();
        });
      });
    });

    describe('#_keySetHandler', function() {
      var value, context;

      beforeEach(function() {
        context = {};
        context.key = 'namespace/bar';
        value = 'foo';
        modelBinder = new ModelBinder(scopeFake, parse, _key);
      });

      it('updates the value of the model in scope', function() {
        modelBinder._keySetHandler(value, context);
        assert.equal(scopeFake.bar, 'foo');
      });
    });

    describe('#_keyToModel', function() {
     var value, context;

      beforeEach(function() {
        context = {};
        context.key = 'namespace/bar';
        value = 'foo';
        modelBinder = new ModelBinder(scopeFake, parse, _key);
      });

      it('returns the model name when passed a key', function() {
        var modelName = modelBinder._keyToModel(context.key);

        assert.equal(modelName, 'bar');
      });
    });

    describe('#cleanup', function() {
      var _key;

      beforeEach(function() {
        _key = createFakeKey('foo');

        modelBinder = new ModelBinder(scopeFake, parse, _key);
      });

      it('removes the listener', function(done) {
        modelBinder.cleanup(function() {
          assert(_key.off.called);
          done();
        });
      });

      it('calls the stopwatch', function(done) {
        var stopWatch = sandbox.stub();
        modelBinder._stopWatchs = [];
        modelBinder._stopWatchs.push(stopWatch);

        modelBinder.cleanup(function() {
          assert(stopWatch.called);
          done();
        });
      });
    });
  });

  describe('ScopeScrubber', function() {
    var scopeScrubber;

    describe('Constructor', function() {
      var opts;

      beforeEach(function() {
        opts = {
          _include: ['foo', /bar.*/],
          _exclude: ['bar', /bar.*/]
        };
      });

      it('creates and returns a new instance', function() {
        assert.noException(function() {
          scopeScrubber = new ScopeScrubber();
        });

        assert.instanceOf(scopeScrubber, ScopeScrubber);
      });

      it('seperates strings and RegExp', function() {
        assert.noException(function() {
          scopeScrubber = new ScopeScrubber(opts);
        });

        assert(_.isString(scopeScrubber._include[0]));
        assert(_.isRegExp(scopeScrubber._includeRegExp[0]));

        assert(_.isString(scopeScrubber._exclude[0]));
        assert(_.isRegExp(scopeScrubber._excludeRegExp[0]));
      });
    });

    describe('#clean', function() {
      var cleanKeys;

      it('invokes keyFilter', function() {
        scopeScrubber = new ScopeScrubber();
        scopeScrubber._filter = sandbox.stub();
        cleanKeys = scopeScrubber.clean(scopeFake);

        assert(scopeScrubber._filter.called);
      });
    });

    describe('#_included', function() {
      var key;

      beforeEach(function() {
        scopeScrubber = new ScopeScrubber();
        key = 'foo';
      });

      it('returns true if a key is included as a string', function() {
        scopeScrubber._include = ['foo'];

        assert(scopeScrubber._included('foo'));
      });

      it('returns true if a key matchs included RegEx', function() {
        scopeScrubber._includeRegExp = [/fo.*/];

        assert(scopeScrubber._included('foo'));
      });

      it('returns true if a key is excluded as a string', function() {
        scopeScrubber._exclude = ['foo'];

        assert(scopeScrubber._excluded('foo'));
      });

      it('returns true if a key matchs excluded RegEx', function() {
        scopeScrubber._excludeRegExp = [/fo.*/];

        assert(scopeScrubber._excluded('foo'));
      });

      it('returns false if a key is not included', function() {
        scopeScrubber._include = ['foo'];

        assert.isFalse(scopeScrubber._included('bar'));
      });


      it('returns false if a key does not match included RegEx', function() {
        scopeScrubber._includeRegExp = [/fo.*/];

        assert.isFalse(scopeScrubber._included('bar'));
      });

      it('returns false if a key is not excluded as a string', function() {
        scopeScrubber._exclude = ['foo'];

        assert.isFalse(scopeScrubber._excluded('bar'));
      });

      it('returns false if a key does not match excluded RegEx', function() {
        scopeScrubber._excludeRegExp = [/fo.*/];

        assert.isFalse(scopeScrubber._excluded('bar'));
      });
    });

    describe('#_filter', function() {
      var testName;
      var sandbox = sinon.sandbox.create();

      beforeEach(function() {
        scopeScrubber = new ScopeScrubber();
      });

      afterEach(function() {
        sandbox.restore();
      });

      var inputCases = [
        {
          testArg: 'value',
          testType: 'a function',
          key: 'foo',
          value: sandbox.spy(),
          expectedLength: 0
        },
        {
          testArg: 'value',
          testType: 'an object containing a function',
          key: 'foo',
          value: { foo: sandbox.stub() },
          expectedLength: 0
        },
        {
          testArg: 'value',
          testType: 'an object containing a nested function',
          key: 'foo',
          value: { foo: { bar: sandbox.stub() } },
          expectedLength: 0
        },
        {
          testArg: 'key',
          testType: 'angular specific [$id]',
          key: '$id',
          value: sandbox.spy(),
          expectedLength: 0
        },
        {
          testArg: 'key',
          testType: 'angular specific [$$listeners]',
          key: '$$listeners',
          value: sandbox.spy(),
          expectedLength: 0
        },
        {
          testArg: 'key',
          testType: 'angular specific [$parent]',
          key: '$parent',
          value: sandbox.spy(),
          expectedLength: 0
        },
        {
          testArg: 'key',
          testType: 'angular specific [$$asyncQueue]',
          key: '$$asyncQueue',
          value: sandbox.spy(),
          expectedLength: 0
        },
        {
          testArg: 'key',
          testType: 'angular specific [$$childHead]',
          key: '$childHead',
          value: sandbox.spy(),
          expectedLength: 0
        },
        {
          testArg: 'key',
          testType: 'angular specific [$$nextSibling]',
          key: '$$nextSibling',
          value: sandbox.spy(),
          expectedLength: 0
        },
        {
          testArg: 'key',
          testType: 'angular specific [$$prevSibling]',
          key: '$prevSibling',
          value: sandbox.spy(),
          expectedLength: 0
        },
        {
          testArg: 'key',
          testType: 'angular specific model [$$watchers]',
          key: '$$watchers',
          value: sandbox.spy(),
          expectedLength: 0
        },
        {
          testArg: 'key',
          testType: 'angular specific model [this]',
          key: 'this',
          value: sandbox.spy(),
          expectedLength: 0
        }
      ];

      _.each(inputCases, function(ic) {
        testName = 'filters models where ' + ic.testArg + ' is ' + ic.testType;

        it(testName, function() {
          scopeScrubber._filter(ic.value, ic.key);
          assert.equal(scopeScrubber.cleanKeys.length, ic.expectedLength);
        });
      });
    });
  });

  function createFakeKey(name) {
    var fakeKey = {
      name: name,
      get: sandbox.stub().yields(),
      set: sandbox.stub().yields(),
      remove: sandbox.stub().yields(),
      on: sandbox.stub().callsArg(2),
      off: sandbox.stub().callsArg(2)
    };
    fakeKey.key = sinon.spy(function() { return fakeKey; });

    return fakeKey;
  }
});
