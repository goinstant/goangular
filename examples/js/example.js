/* jshint browser: true */
/* global require, console, angular, CONFIG */

/**
 * @fileOverview
 *
 * This file contains an example, only designed for use during development
 */

'use strict';

/** Module Dependencies */

require('goangular');
var _ = require('lodash');

// Create an AngularJS application module
var ourCoolApp = angular.module('ourCoolApp', ['goangular']);

ourCoolApp.config(function(goConnectionProvider) {
  goConnectionProvider.set(CONFIG.connectUrl);
});

ourCoolApp.controller('sweetController', function($scope, goSync, goConnection) {

  // $scope.todos = $goSync.room('dfdf').key('dfdf');

  // $scope.todos.$on('ready', function() {
  //   // ready
  // });

  goConnection.ready().get('rooms').spread(function(lobby) {
    goSync($scope, 'todos', lobby.key('to')).initialize().then(function(goSyncUnbind) {
      goSyncUnbind.destroy();
    });
  });


  // var goSyncScopePromise = goSyncScope($scope, 'SyncCtrl', { room: 'logoosdo', include: ['todos'] }).initialize();

  // goSyncScopePromise.then(function() {
  //   console.log(arguments);
  // }).catch(function() {
  //   console.log(arguments);
  // });


  $scope.addTodo = function() {
    if ($scope.newTodo !== '') {
      $scope.todos.push($scope.newTodo);
      $scope.newTodo = '';
    }
  };

  // var namespace;

  // // Just return, don't join
  // goRooms.get('alpha').then(function(alphaRoom) {
  //   namespace = alpha.key('blah');
  // });

  // // Join and return
  // goRooms.join('alpha').then(function(alpha) {
  //   namespace = alpha.key('blah');
  // });

  // goSync($scope, 'foo', fooKey); // model <-> key

  // $scope.foo = goSyncCollection(fooCollectionKey, cb); // collection

  // $scope.name = 'Bob';

  //var goAngular = new goSync($scope, 'SyncCtrl', { room: 'logo' });

  // // Begin synchronization
  // goAngular.initialize().then(function() {
  //   console.log(arguments);
  // }).catch(function() {
  //   console.log(arguments);
  // });

  // var foo = 'default';
  // var fooKey;

  // goConnection.ready().then(function(result) {
  //   fooKey = result.rooms[0].key('foo');
  //   return fooKey.get();
  // }).then(function(result) {
  //   return (result.value ? result : fooKey.set(foo));
  // }).then(function(result) {
  //   foo = result.value;
  //   fooKey.on('set', function(newVal) {
  //     foo = newVal;
  //   });
  // }).catch(function(err) {
  //   console.log(err);
  // });

  // var sweetNamespace = goConnection.ready().get('rooms').get(0).invoke('key', 'sweetNamespace')

  // sweetNamespace.invoke('set', {
  //   ding: 'dong', witch: 'is dead'
  // }).get('value').then(function(value) {
  //   console.log(value)
  //   return Q.all(_.map(_.keys(value), function(key) {
  //     return sweetNamespace.invoke('key', key).invoke('set', 'new value');
  //   }));
  // }).spread(function(setResultOne, setResultTwo) {
  //   console.log(setResultOne.value);
  //   console.log(setResultTwo.value);
  // })
  // .catch(function() {
  //   console.log(arguments);
  // });

  // console.log(sweetNamespace)
    // .invoke('get').get('value')
    // .then(function(value) {
    //   console.log(value);
    // })
    // .catch(function(err) {
    //   throw err;
    // });
    // // .then(function(connection) {
    //   return connection.room('lobby').join();
    // })
    // .get('room').then(function(lobby) {
    //   return lobby.key('sweetNamespace');
    // })
    // .then(function(namespace) {
    //   return namespace.set('boo');
    // })
    // .get('context').then(function(context) {
    //   console.log('new value of our namespace: ', context.value);
    // })
    // //.finally($scope.$apply.bind($scope));
    // .catch(function(err) {
    //   console.log('Error:', err);
    // });

    // $scope.currentUser = {};
    // $scope.currentUser.displayName = 'Bob';
    // $scope.newTodo = '';
    // $scope.todos = [];

    // goConnect.then(function(goinstant) {
    //   console.log(goinstant);

    //   goinstant.connection.room('customRoom').join(function(err, customRoom) {
    //     console.log('customRoom', customRoom);

    //     var goAngular = new GoAngular($scope, 'sweetController', {
    //       room: customRoom,
    //       include: ['todos']
    //     });

    //     goAngular
    //       .initialize()
    //       .then(function() {
    //         console.log('Success: scope is being synchronized');
    //       }, function(err) {
    //         console.error('Error', err);
    //       });
    //   });
    // });

    // goUsers
    //   .room('lobby')
    //   .initialize()
    //   .then(function(lobbyUsers) {
    //     var localUser = lobbyUsers.self();

    //     console.log(localUser);

    //     $scope.currentUser.displayName = localUser.get('displayName');

    //     $scope.$watch('currentUser.displayName', function(newVal, oldVal) {
    //       if (newVal === oldVal) {
    //         return;
    //       }

    //       localUser.set('displayName', newVal);
    //     });

    //     localUser.on('change', function() {
    //       $scope.$apply(function() {
    //         $scope.currentUser.displayName = localUser.get('displayName');
    //       });
    //     });

    //     localUser.set('displayName', 'frank')
    //       .then(function() {
    //         console.log('name', localUser.get('displayName'));
    //       });

    //     angular.forEach(lobbyUsers.users(), function(user) {
    //       console.log(user);
    //     });

    //     lobbyUsers.on('join', function(user) {
    //       console.log(user);
    //     });

    //     lobbyUsers.on('leave', function(user) {
    //       console.log(user);
    //     });
    //   });



    //   $scope.removeTodo = function(index) {
    //     $scope.todos.splice(index, 1);
    //   };
});
