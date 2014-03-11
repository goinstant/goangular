# $sync

```
Stability: 3 - Stable
```

Retrieves the current value of the key associated with this model and monitors
it for changes, keeping the model in sync with the  associated key.
***Note: changes made directly to the object do not persist back to the key.***

### Example

Synchronize a collection of todos:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos.$goKey('todos');
  $scope.todos.$sync();
  $scope.todos.$on('ready', function() {
    // Our todos collection is being synchronized!
  });
});
```

## Methods

- ###### **model.$sync()**

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
