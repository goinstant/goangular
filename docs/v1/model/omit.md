# model#$omit

Returns a new object, sans properties prefixed with `$`.

## Methods

- ###### **model.$omit()**

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

      // Create a new object, absent properties prefixed with $
      var todos = $scope.todos.$omit();

      // Iterate through and remove completed todos
      angular.forEach(todos, function(todo, key) {
        if (todo.complete) {
          $scope.todos.$key(key).$remove();
        }
      });
    });
  });
```