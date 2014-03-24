# $getUser

```
Stability: 3 - Stable
```

The `$getUser` method creates a new GoAngular model for a user given a user id.
`$getUser` is simply an alias for `$key` but only available on a [UsersModel](./index.md)

## Methods

- ###### **model.$getUser(id)**

## Parameters

| id |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). |
| The id of the user to create a model of. |

## Returns

| [GoAngular Key Model](../key_model/index.md) |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| A new model, with methods for retrieving, manipulating and persisting data. |

## Example

Create a new model of a user with an id of `A_USER_ID`:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goUsers) {
  $scope.users = $goUsers().$sync();

  $scope.aUser = $scope.users.$getUser('A_USER_ID').$sync();
});
```
