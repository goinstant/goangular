# $goKey

```
Stability: 4 - Stable
```

The `$goKey` method has only a single required parameter, a `keyName`, which is a string, referencing a specific location
in your GoInstant applications data structure.  It returns a [GoAngular Model](./model/index.md).

## Methods

- ###### **$goKey(keyName)**
- ###### **$goKey(keyName, roomName)**


## Parameters

| keyName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). |
| The name of the key to be referenced. [Naming restrictions apply.](../key/index.md#on-key-naming) A leading forward-slash ('/') is implied, (e.g. 'foo/bar' is the same as '/foo/bar'). |

| roomName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). |
| The name of the room to which your key belongs. This room will be joined automatically. |

## Returns

| [GoAngular Model](./model/index.md) |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| A new model, with methods for retrieving, manipulating and persisting data. |

## Example

Create a model for a single todo, relative to a collection of todos:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos');
  $scope.todos.$sync();
  $scope.todos.$on('ready', function() {
    var todoOne = $scope.todos.$key('todo_1');
    todoOne.$key('description').$set('a new description');
  });
});
```
