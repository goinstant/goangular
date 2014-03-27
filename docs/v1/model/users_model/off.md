# $off

```
Stability: 2 - Unstable
```

The `#off` method allows you to remove a listener from a room, key associated with
this model, or from the model itself.

## Methods

- ###### model.$off()
- ###### model.$off(eventName)
- ###### model.$off(eventName, listener(user))
- ###### model.$off(eventName, listener(value, contextObject))
- ###### model.$off(eventName, optionsObject, listener(value, contextObject))
- ###### model.$off(null, optionsObject, listener(value, contextObject))

## Parameters

| eventName |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| The event stop monitoring. |
| Must be one of the monitorable events documented in [model#on](./on.html). |

| listener(user) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A previously-attached listener to remove. |
| - `user` will be the userObject associated with the user who triggered the event. |

| listener(value, contextObject) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A previously-attached listener to remove. |
| - `value` will be the value of the model upon the listener being called. |
| - `contextObject` will be a [KeyContext](../../javascript_api/key/context.html) object for the event. |

| listener(errorObject) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A listener to be called when an error occurs. |
| - `errorObject` will contain the error that occurred. |

| optionsObject |
|:---|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| An object with three properties, `listener`, `local` and `bubble`, that determine how this action behaves. |
| - `local` [**default: false**] is a boolean where, if true, the listener will be triggered for local events. |
| - `bubble` [**default: false**] is a boolean where, if true, the listener will bubble events. |

## Example

Remove a `join` listener:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goUsers) {
  $scope.users = $goUsers();

  var listener = function(user) {
    console.log(user, 'join');
  };

  $scope.users.$on('join', listener);

  $scope.users.$off('join', listener);
});
```
