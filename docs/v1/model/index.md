# Model

A model is an object created and returned by the [$goKey](../key.md) factory,
[$goUsers](../users.md) factory and [usersModel#$self](./users_model/self.md) method.
It encapsulates your application's data and provides an API to access, manipulate
and persist that data.

This page contains an index of the three models created by GoAngular, methods
available on the models, and some introductory examples (based on the universal
todo app) to help you get started.

## Table of Contents

1. [API](#api)
2. [Accessing Data](#accessing-data)
3. [Retrieving & Persisting a Model](#retrieving-&-persisting-a-model)
4. [Manipulating Data](./key_model/index.html#manipulating-data)
5. [Managing Users' Data](./users_model/index.html#managing-users'-data)
6. [Local User's Data](./users_model/index.html#local-user's-data)

## API

| [$key(name)](./key.md)|
|:--|
| Creates a new model instance, with a relative key. |

| [$omit()](./off.md)|
|:--|
| Returns a new object, sans properties prefixed with `$`. |

| [$sync()](./sync.md)|
|:--|
| Retrieves the current value of the key associated with this model and monitors it for changes, keeping the model in sync with the  associated key.  ***Note: changes made directly to the object do not persist back to the key.*** |

| [$on(eventName, handler)](./on.md)|
|:--|
| Adds an event handler. Can be used to monitor when a model is ready or errors. |

| [$off(eventName, handler)](./off.md)|
|:--|
| Removes an event handler. |

### [Key Model](./key_model/index.md)

[$goKey](../key.md) returns a key model, which inherits the base [GoAngular model](./index.md) then extends it with key-specific properties and methods.

### [UsersModel](./users_model/index.md)

[$goUsers](../users.md) returns a users model, which inherits the base [GoAngular model](./index.md) then extends it with users-specific properties and methods.

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

## Conclusion

To summarize the most important points:

-  Models are returned by the methods: `$goKey()`, `keyModel#$key()`, and `$goUsers()`
-  They're an extensible adapter for a GoInstant key, and include features for retrieving, persisting, and manipulating application/user data.
-  Regardless of the value associated with a key, the model is an object.
-  If the value is a primitive, you'll find it at `model.$value`
-  If the value is an array, it will be converted to an object.
-  `model.$sync` does not persist changes made directly to the object.  It monitors the key for changes, keeping the local model in sync.
