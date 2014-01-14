# model#$add

## Description

Working with collections? The `$add` method might be your best friend, it generates a unique name/id, appends the value you provide to the key associated with the
model in chronological order and returns a promise.  If the model is being
synchronized (you have invoked the `$sync` method) it will be updated also.

### TL;DR Example

Adding a new todo, to a collection of todos:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos.$goKey('todos').$sync();
  $scope.todos.$on('ready', function() {
    $scope.todos.$add({
      description: 'Sign-up for GoInstant',
      complete: false
    }).then(function() {
      console.log('It worked!');
    });
  });
});
```

## Methods

- ###### **model.$add(value)**
- ###### **model.$add(value, optionsObject)**

## Parameters

| value |
|:---|
| Type: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean), [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), or [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String). |
| The value you wish to add to the key, and the model. |

| optionsObject |
|:---|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| - `local` ***[default: true]*** is a boolean where, if true, the event produced from this action will trigger the listeners that have opted-in to local events.  The local listener is the mechanism by which `$sync` maintains the state of the model, setting this to false will prevent $sync from updating your local model. |
| - `bubble` ***[default: true]*** is a boolean where, if true, the event produced from this action will bubble to all of the parent key listeners. |
| - `expire` ***[default: null]*** is a [time to live](http://en.wikipedia.org/wiki/Time_to_live) on the key in, milliseconds. Once the key expires, a Remove event is triggered. See [expire](https://developers.goinstant.com/v1/javascript_api/key/expire.html) for more information.
[ - `cascade` ***[default: null]*** is a reference to a key that will cause the set key to be removed whenever the referenced key is removed. |

## Returns

| [promiseObject](https://developers.goinstant.com/v1/guides/promises.html) |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| A [Q](https://github.com/kriskowal/q/) powered promise, which will be resolved once the `add` command has been executed or rejected if an error is encountered. The promise will be passed an object containing two properties: |
| - `value` the input you provided. |
| - `contextObject` is the [KeyContext](https://developers.goinstant.com/v1/javascript_api/key/context.html) object for the operation.  The `contextObject` includes an `addedKey` property which contains the generated name/id for the new key. |

## Example

```js
// Specify GoAngular as a dependency and configure your connection
angular.module('yourApp', ['goangular'])
  .config(function(goConnectionProvider) {
    goConnectProvider.set('https://goinstant.net/YOURACCOUNT/YOURAPP');
  })
  // Inject $goKey into your controller
  .controller('completeControl', function($scope, $goKey) {
    // Create a new todos model
    $scope.todos = $goKey('todos');

    // Keep our model current
    $scope.todos.$sync();

    // Wait for synchronization to be complete
    $scope.todos.$on('ready', function() {

      // Add a new todo
      $scope.todos.$add({
        description: 'Watch GhostBusters',
        complete: false
      }).then(
        function(result) {
          // Added
        },
        function(err) {
          // Error encountered
        }
      );
    });
  });
```