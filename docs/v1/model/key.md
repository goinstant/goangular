# model#$key

## Description

The `$key` method creates a new GoAngular model for a child property, based on the
provided key name.

## Methods

- ###### **model.$key(keyName)**

## Parameters

| keyName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). |
| The name of the key to be referenced. [Naming restrictions apply.](Naming restrictions apply) A leading forward-slash ('/') is implied, (e.g. 'foo/bar' is the same as '/foo/bar'). |

## Returns

| [GoAngular Model](./index.md) |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| A new model, with methods for retrieving, manipulating and persisting data. |

## Example

Create a model for a single todo, relative to a collection of todos:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos').$sync();

  $scope.todos.$on('ready', function() {
    var todoOne = $scope.todos.$key('todo_1');
    todoOne.$key('description').$set('a new description');
  });
});
```