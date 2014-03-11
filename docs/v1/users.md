# $goUsers

```
Stability: 2 - Experimental
```

The `$goUsers` method returns a [GoAngular Users Model](./model/users_model/index.md) of the
`.users` key. The `.users` key in a GoInstant application is a collection of all
the users who have joined a specific room.

## Methods

- ###### **$goUsers()**
- ###### **$goUsers(roomName)**

## Parameters

| roomName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). |
| The name of the room to which your key belongs. This room will be joined automatically. |

## Returns

| [GoAngular Users Model](./model/users_model/index.md) |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| A new model, with methods for retrieving, manipulating and users persisting data. |

## Examples

Create a model of the users in the default room

```js
angular.module('yourApp').controller('usersCtrl', function($scope, $goUsers) {
  // Create a users model and sync it
  $scope.users = $goUsers().$sync();

  $scope.users.$on('ready', function() {
    // Do something with the users model
  });

  $scope.users.$on('join', function(user) {
    // Handle a user joining
  });

  $scope.users.$on('leave', function(user) {
    // Handle a user leaving
  });
});
```

Create a model of the users in a specific room

```js
angular.module('yourApp').controller('usersCtrl', function($scope, $goUsers) {
  $scope.users = $goUsers('myRoomName').$sync();
});
```
