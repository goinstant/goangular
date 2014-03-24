# $on

```
Stability: 2 - Unstable
```

Used to monitor when the model is `ready` or if an `error` has triggered. The
`#on` method allows you to register a listener to these model events.

The `ready` listener will be passed no arguments and is called when the model is
first synchronized.

The `error` listener will be passed a single `errorObject` argument if
triggered.

## Monitorable Events

- ###### `ready`
- ###### `error`

## Methods

- ###### model.$on(eventName, listener())
- ###### model.$on(eventName, listener(errorObject))

## Parameters

| eventName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| The event to monitor. |
| Must be one of the monitorable events listed above. Otherwise, an error will be thrown. |

| listener() |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A listener to be called when the model is `ready`. |

| listener(errorObject) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A listener to be called if an `error` occurs. |
| - `errorObject` will contain the error that occurred. |

## Examples

Register a listener to a model's `ready` event

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos').$sync();

  $scope.todos.$on('ready', function() {
    // Do stuff here
  });
});
```

Register a listener to a model's `error` event

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos').$sync();

  $scope.todos.$on('error', function(errorObject) {
    // Handle error here
    console.log(errorObject);
  });
});
```
