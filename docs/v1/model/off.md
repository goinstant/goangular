# $off

```
Stability: 2 - Unstable
```

The `#off` method allows you to remove a listener from a key associated with
this model.

## Methods

- ###### model.off()
- ###### model.off(eventName)
- ###### model.$off(eventName, listener(value, contextObject))
- ###### model.$off(eventName, optionsObject, listener(value, contextObject))
- ###### model.$off(null, optionsObject, listener(value, contextObject))

## Parameters

| eventName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| The event stop monitoring. |
| Must be one of the monitorable events documented in [model#on](./on.html). |

| listener(value, contextObject) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A previously-attached listener to remove. |
| - `value` will be the value of the model upon the listener being called. |
| - `contextObject` will be a [KeyContext](../../javascript_api/key/context.html) object for the event. |

| optionsObject |
|:---|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| An object with three properties, `listener`, `local` and `bubble`, that determine how this action behaves. |
| - `listener` **Deprecated**: Pass the listener as a separate argument as shown above. |
| - `local` [**default: false**] is a boolean where, if true, the listener will be triggered for local events. |
| - `bubble` [**default: false**] is a boolean where, if true, the listener will bubble events. |

## Example

Remove a listener on a collection of todos.

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos').$sync();

  var opts = {
    local: true,
    bubble: true
  };

  var listener = function(value) {
    console.log(value);
  };

  $scope.todos.$on('set', opts, listener);

  // Removes the listener defined above
  $scope.todos.$off('set', opts, listener);
});
```

Remove all listeners and stop synchronizing the model

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos').$sync();

  var listener = function(value) {
    console.log(value);
  };

  var opts = {
    bubble: true
  };

  $scope.todos.$on('set', listener);
  $scope.todos.$on('add', listener);
  $scope.todos.$on('remove', opts, listener);

  // Removes all listeners defined above and stops monitoring for changes
  // via `$sync`
  $scope.todos.$off();
});
```
