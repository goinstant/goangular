# $goQuery

The `$goQuery` method enables you to filter, sort and limit the children of a key, using a MongoDb inspired query syntax. It returns a [GoAngular Model](./model/index.md).

## Methods

- ###### **$goQuery(keyName, expr)**
- ###### **$goQuery(keyName, optionsObject)**
- ###### **$goQuery(keyName, expr, optionsObject)**
- ###### **$goQuery(keyName, roomName, expr, optionsObject)**


## Parameters

| keyName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). |
| The name of the key to be referenced. [Naming restrictions apply.](Naming restrictions apply) A leading forward-slash ('/') is implied, (e.g. 'foo/bar' is the same as '/foo/bar'). |

| roomName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). |
| The name of the room to which your key belongs. This room will be joined automatically. Defaults to Lobby. |

| expr |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| An optional MongoDB-like selector that is applied to return matching child keys. |

| optionsObject |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| An optional object that determines how the results of the query are sorted and selected. |
| - `sort` ***[default: null]*** A string or array that describes the sort order, see [Sorting](https://developers.goinstant.com/v1/javascript_api/query/sorting.html) for more details. |
| - `limit` ***[default: null]*** A number or array that describes the selecting behavior, see [Limiting](https://developers.goinstant.com/v1/javascript_api/query/limiting.html) for more details. |

## Returns

| [GoAngular Model](./model/index.md) |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| A new model, with methods for retrieving, manipulating and persisting data. |

## Example

The following example queries the todos key, returning five, in-complete items:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goQuery) {
  var expr = { complete: false };
  var options = { limit: 10 };

  $scope.todos = $goQuery('todos', expr, options);
  $scope.todos.$sync();
  $scope.todos.$on('ready', function() {
    console.log($scope.todos); // in-complete todos!
  });
});
```