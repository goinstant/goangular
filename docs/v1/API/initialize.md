# GoAngular#initialize

## Description

The `goAngular.initialize` method is used to begin the synchronization of models
between two clients.  Models without an existing value stored in GoInstant
default to the value currently assigned in scope. This method accepts no parameters.

*Note: You must configure your GoInstant connection with the `goConnection` provider
prior to creating a new instance of GoAngular*

## Methods

- ###### **goAngular.initialize()**

## Returns

| goAngularPromise |
| :--|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| An Angular `deferred.promise` object ([$q](http://docs.angularjs.org/api/ng.$q)) which will will be resolved if synchronization is successful and rejected if an error is encountered. |

## Example
```js
// Create a new Angular controller and inject GoAngular
app.controller('YOURCONTROLLERNAME', function($scope, GoAngular) {
  // Create a new instance of GoAngular
  var goAngular = new GoAngular($scope, 'YOURCONTROLLERNAME');

  $scope.newTodo = []; // Will be sync'd
  $scope.newTodo = 'A Todo Item'; // Excluded from sync

  goAngular.initialize().then(
    // Called on successful synchronization
    function() {
      // now the form will be synchronized
    },
    // Called if an error is encountered
    function(err) {
      console.error('Problem establishing synchronization', err);
    }
  );
});
```
