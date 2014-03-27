# $off

```
Stability: 2 - Unstable
```

The `#off` method allows you to remove a listener from the model.

## Methods

- ###### model.$off()
- ###### model.$off(eventName)
- ###### model.$off(eventName, listener())

## Parameters

| eventName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| The event stop monitoring. |
| Must be one of the monitorable events documented in [model#$on](./on.html). |

| listener() |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A listener to be called when the model is `ready`. |

| listener(errorObject) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A listener to be called when an error occurs. |
| - `errorObject` will contain the error that occurred. |

## Example

Remove a listener from a model's `ready` event

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos').$sync();

  var listener = function() {
    // Do stuff here
  };

  $scope.todos.$on('ready', listener);

  $scope.todos.$off('ready', listener);
});
```

