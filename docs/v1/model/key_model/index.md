# Key Model

A key model is an object created and returned by the [$goKey](../../key.md) factory.
It encapsulates your application's data and provides an API to access, manipulate
and persist that data.

The Key Model inherits the base [GoAngular model](../index.md) then extends it with key-specific properties and methods.

## Table of Contents

1. [API](#api)
2. [Manipulating Data](#manipulating-data)

## API

| [$key(name)](../key.md)|
|:--|
| Creates a new model instance, with a relative key. |

| [$omit()](../omit.md)|
|:--|
| Returns a new object, sans properties prefixed with `$`. |

| [$sync()](../sync.md)|
|:--|
| Retrieves the current value of the key associated with this model and monitors it for changes, keeping the model in sync with the  associated key.  ***Note: changes made directly to the object do not persist back to the key.*** |

| [$add(value)](./add.md)|
|:--|
| Adds an item to a key with a generated id.  Ids are generated in chronological order. |

| [$set(value)](./set.md)|
|:--|
| Overwrites the remote value of the key associated with this model.  The value of the model will also be updated. |

| [$remove()](./remove.md)|
|:--|
| Removes the remote key and local object. |

| [$on(eventName, opts, handler)](./on.md)|
|:--|
| Adds a key event handler. Can be used to monitor local and remote changes to the model. Extends the implementation of [Model#$on](../on.md). |

| [$off(eventName, opts handler)](./off.md)|
|:--|
| Removes a key event handler. Extends the implementation of [Model#$off](../off.md). |

## Manipulating Data

The key model provides an API for manipulating the data it contains. When you use the
API your local changes are persisted by default. Actually, they're persisted first,
and only once the operation is successful will your local model be updated.
This makes your local model a true representation of your key's remote state.
This might be a bit difficult to digest, but once we run through a few examples,
I think you'll find it a simple, robust concept!

##### Creating a collection & adding our first item

Creating a collection of todos is exactly the same as retrieving one.  We use `$goKey`
to create a key model, based on a reference or key which is just a pointer to a specific
place in our remote data structure in this case `todos`.  Once we have a key model, we can
add an item to it.  The `$add` method is creating a key name for us, and adding it
to the collection in chronological order, so it's nice and easy to sort later:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos').sync();

  $scope.todos.$on('ready', function() {
    console.log($scope.todos); // an empty model

    // let's add a new todo to the collection
  $scope.todos.$add({
    description: 'Add our first todo',
    complete: false
  }).then(function() {
    // We now have a collection, with a single todo
    // it's an object, with a generated key name!
    console.log($scope.todos);
  });
  });
});
```

##### Updating the contents of a collection

We've created a collection of todos, and we've added our first item, now let's
mark the todo as complete!  To accomplish that, we'll use the `$key` method to create
a new key model, relative to our collection and the `$set` method, to mark our todo as complete:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos').sync();

  $scope.todos.$on('ready', function() {

  var addPromise = $scope.todos.$add({
    description: 'Add our first todo',
    complete: false

  });

  // The add operation returns a promise, we'll use the object
  // that's passed to the promise to retrieve the key that has
  // been created!
  addPromise.then(function(result) {
    var addedKeyName = result.context.addedKey

      // Even the properties of our new todo are accessed via. $key
      $scope.todos.$key(addedKeyName).$key('complete').$set(true);
  });
  });
});
```

##### Removing an item from a collection

So our todo is complete, but we should clean up our collection and remove it.  We'll
 need a reference to the todo we want to remove (just as we did when we marked it
 as complete), then we'll just call the `$remove` method:

```js
angular.module('yourApp').controller('aCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos').sync();

  $scope.todos.$on('ready', function() {
    // The filter method helps us clean methods prefixed with $ prior to iteration
    var todos = $scope.todos.$omit();

    // Iterate through each of the todos
    angular.forEach(todos, function(todo, key) {
      // Remove completed todos
      if (todo.complete) {
        $scope.todos.$key(key).$remove();
      }
    });
  });
});
```
