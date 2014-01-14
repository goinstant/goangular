# Model

A model is an object created and returned by the [$goKey](../key.md) factory.
It encapsulates your application's data and provides an API to access, manipulate
and persist that data.

This page contains an index of the methods available on a model and some
introductory examples (based on the universal todo app) to help you get started.

## Table of Contents

1. [API](#api)
2. [Accessing Data](#$goConnect#$set)
3. [Retrieving & Persisting a Model](#model#data)
4. [Manipulating Data](#$goConnect#$ready)

## API

| [$sync()](./sync.md)|
|:--|
| Retrieves the current value of the key associated with this model and monitors it for changes, keeping the model in sync with the  associated key.  ***Note: changes made directly to the object do not persist back to the key.*** |

| [$key(name)](./key.md)|
|:--|
| Creates a new model instance, with a relative key. |

| [$set(value)](./set.md)|
|:--|
| Overwrites the remote value of the key associated with this model.  The value of the model will also be updated. |

| [$add(value)](./add.md)|
|:--|
| Adds an item to a key with a generated id.  Ids are generated in chronological order. |

| [$remove()](./remove.md)|
|:--|
| Removes the remote key and local object. |

| [$on(eventName, handler)](./on.md)|
|:--|
| Adds an event handler. Can be used to monitor both local and remote changes. |

| [$off(eventName, handler)](./off.md)|
|:--|
| Removes an event handler. |

| [$omit()](./off.md)|
|:--|
| Returns a new object, sans properties prefixed with `$`. |


## Accessing Data

When Angular parses an object it removes properties prefixed with a `$`.  We take
advantage of this behavior to provide access to data directly on the model object,
safety eliminating the need for a traditional getter.

### How is data stored on the model?

The shape of a model depends on the data it contains.  For the sake of brevity
these examples omit the model object's methods:

##### A primitive (boolean, string, number, etc.) will be assigned to `model.$value`

```json
{ $value: true }
```

#####  An array will be converted to an object, it's indexes becoming keys

```json
{ 1: 'item one', 2: 'item two }
```

##### While objects are assigned directly to the model

```json
{ foo: 'bar,  bar: 'foo' }
```

### How do I access it?

The model is just a basic object, once you've retrieved or synchronized the model,
the data is available directly on the object:

##### Accessing data in our view

Make our todos model available on scope:
```js
angular.module('yourApp').controller('aCtrl', function($goKey) {
  $scope.todos = $goKey('todos').$sync();
});
```

Then use them in your Angular view:
```html
<ul ng-controller="aCtrl">
  <li ng-repeat="todo in todos">{{ todo.description }}</li>
</ul>
```

##### Accessing data in a controller

The model is just a plain old object, it likes to be treated like one:
```js
angular.module('yourApp').controller('aCtrl', function($goKey) {
  $scope.todos = $goKey('todos').sync();

  $scope.todos.$on('ready', function() {
    // The $omit method helps us clean methods prefixed with $ prior to iteration
    var todos = $scope.todos.$omit();

    angular.forEach(todos, function(todo) {
      console.log('todo description:', todo.description);
    });
  });
});
```

## Retrieving & Persisting a Model

In most cases, we'll be assigning our model to `$scope` and using it to drive
changes in a view.  GoAngular provides the `$sync` method which:

1.  Retrieves the current value of a key.
2.  Assigns the value of the key to the model.
3.  Listens for changes to our key, and updates the model when the contents of
the key changes, regardless of which client generates those changes.
4.  Triggers the `ready` event, once the model has been synchronized.

***It's important to note, that `$sync` will not persist changes made directly to our model object, in the
other direction, back to our key.***

## Manipulating Data

The model provides an API for manipulating the data it contains. When you use the
API your local changes are persisted by default. Actually, they're persisted first,
and only once the operation is successful will your local model be updated.
This makes your local model a true representation of your key's remote state.
This might be a bit difficult to digest, but once we run through a few examples,
I think you'll find it a simple, robust concept!

##### Creating a collection & adding our first item

Creating a collection of todos is exactly the same as retrieving one.  We use `$goKey`
to create a model, based on a reference or key which is just a pointer to a specific
place in our remote data structure in this case `todos`.  Once we have a model, we can
add an item to it.  The `$add` method is creating a key name for us, and adding it
to the collection in chronological order, so it's nice and easy to sort later:

```js
angular.module('yourApp').controller('aCtrl', function($goKey) {
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
a new model, relative to our collection and the `$set` method, to mark our todo as complete:

```js
angular.module('yourApp').controller('aCtrl', function($goKey) {
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
angular.module('yourApp').controller('aCtrl', function($goKey) {
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

## Conclusion

To summarize the most important points:

-  Models are returned by two methods: `$goKey()` and `model.$key()`
-  They're an extensible adapter for a GoInstant key, and include features for
retrieving, persisting, and manipulating application data.
-  Regardless of the value associated with a key, the model is an object.
-  If the value is a primitive, you'll find it at `model.$value`
-  If the value is an array, it will be converted to an object.
-  `model.$sync` does not persist changes made directly to the object.  It monitors
the key for changes, keeping the local model in sync.
-  Methods that manipulate a model (`$add`, `$set`, `$remove`) update the value
of the key, and ***then*** update the local model object.
