# $self

```
Stability: 1 - Experimental
```

The `$self` method creates a self model of the local user.

## Methods

- ###### **model.$self()**

## Returns

| [promiseObject](https://developers.goinstant.com/v1/guides/promises.html) |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| A [Q](https://github.com/kriskowal/q/) powered promise, which will be resolved once you are connected to GoInstant. The promise will be passed a new [selfModel](../self_model/index.md) of the local user. |

## Example

Create a model for a single todo, relative to a collection of todos:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goUsers) {
  $goUsers.$self().then(function(selfModel) {
    $scope.self = selfModel.$sync();
  });
});
```
