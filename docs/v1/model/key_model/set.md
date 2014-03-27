# $set

```
Stability: 3 - Stable
```

The `$set` method first overwrites the remote value of the key associated with this model.  Once this operation is complete the local
model object is updated to the new value.

## Methods

- ###### **model.$set(value)**
- ###### **model.$set(value, optionsObject)**

## Parameters

| value |
|:---|
| Type: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean), [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), or [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). |
| The new key value. Must not be `null`, `undefined`, or greater than 32kb in size. |

| optionsObject |
|:---|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| - `overwrite` ***[default:true]*** is a boolean where, if true, the set command will overwrite any existing value. If false, the set command will produce an error if the key already has a value. |
| - `local` ***[default: true]*** is a boolean where, if true, the event produced from this action will trigger the listeners that have opted-in to local events.  The local listener is the mechanism by which `$sync` maintains the state of the model, setting this to false will prevent $sync from updating your local model. |
| - `bubble` ***[default: true]*** is a boolean where, if true, the event produced from this action will bubble to all of the parent key listeners. |
| - `expire` ***[default: null]*** is a [time to live](http://en.wikipedia.org/wiki/Time_to_live) on the key in, milliseconds. Once the key expires, a Remove event is triggered. See [expire](https://developers.goinstant.com/v1/javascript_api/key/expire.html) for more information.
| - `cascade` ***[default: null]*** is a reference to a key that will cause the set key to be removed whenever the referenced key is removed. |

## Returns

| [promiseObject](https://developers.goinstant.com/v1/guides/promises.html) |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| A [Q](https://github.com/kriskowal/q/) powered promise, which will be resolved once the `add` command has been executed or rejected if an error is encountered. The promise will be passed an object containing two properties: |
| - `value` the input you provided. |
| - `contextObject` is the [KeyContext](https://developers.goinstant.com/v1/javascript_api/key/context.html) object for the operation. |

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
