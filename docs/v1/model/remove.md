# $remove

```
Stability: 3 - Stable
```

The `$remove` method removes the key associated with the GoAngular model
and all sub-keys.

## Methods

- ###### **model.$remove()**
- ###### **model.$remove(optionsObject)**

## Parameters

| optionsObject |
|:---|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| - `local` ***[default: true]*** is a boolean where, if true, the event produced from this action will trigger the listeners that have opted-in to local events.  The local listener is the mechanism by which `$sync` maintains the state of the model, setting this to false will prevent $sync from updating your local model. |
| - `bubble` ***[default: true]*** is a boolean where, if true, the event produced from this action will bubble to all of the parent key listeners. |
| - `lastValue` ***[default:false]*** is a boolean where, if true, the value of the key at the time of deletion will be returned in the callback.|

## Returns

| [promiseObject](https://developers.goinstant.com/v1/guides/promises.html) |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| A [Q](https://github.com/kriskowal/q/) powered promise, which will be resolved once the `add` command has been executed or rejected if an error is encountered. The promise will be passed an object containing two properties: |
| - `value` the input you provided. |
| - `contextObject` is the [KeyContext](https://developers.goinstant.com/v1/javascript_api/key/context.html) object for the operation. |

## Example

Removing a collection of todos:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $goKey('todos').$remove().then(function() {
    // Nothing left todo!
  });
});
```
