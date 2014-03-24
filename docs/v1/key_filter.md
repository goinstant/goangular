# keyFilter

```
Stability: 3 - Stable
```

The `keyFilter` angular [filter](http://docs.angularjs.org/guide/filter) is used
to convert a collection of models to an [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
of [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).
The structure of these objects depend on the type of data it contains.

Non-primitive data types (objects, arrays) will simply have a new `$name`
property containing the key name it is associated with.

```js
// model
{
  id1: { a: 1, b: 2},
  id2: { a: 3, b: 4}
}

// keyFilter result
[
  { $name: 'id1', a: 1, b: 2 },
  { $name: 'id2', a: 3, b: 4 }
]
```

Primitive data types (strings, numbers, booleans) will be converted to an object
with the same `$name` property as non-primitives and a new `$value` property
containing the primitive's value.

```js
// model
{
  id1: 123,
  id2: 456
}

// keyFilter result
[
  { $name: 'id1', $value: 123 },
  { $name: 'id2', $value: 456 }
]
```

## Usage

### In HTML Template Binding

- ###### {{ expression | keyFilter : enabled }}

### In JavaScript

- ###### $filter('keyFilter')(collection);
- ###### $filter('keyFilter')(collection, enabled);

## Parameters

| collection |
|:---|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object). |
| A collection to convert to an array. |

| enabled |
|:---|
| Type: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean). |
| A boolean to bypass the filter. Default: false, filter is enabled. |

## Returns

| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) |
| :--|
| A new array of objects with a `$name` property containing the key name that the model is associated with. |

## Example

Sort a GoAngular model by key name using Angular's built-in orderBy filter.

```js
chatApp.controller('TodoCtrl', function($scope, $goKey) {
  $scope.todos = $goKey('todos');
  $scope.todos.$sync();

  $scope.addTodo = function() {

    var todo = {
      description: $scope.todoDescription,
      complete: false
    };

    $scope.todos.$add(todo).then(function() {
      $scope.todoDescription = '';
    });
  };
});
```

```html
<form ng-submit="addTodo()">
  <input type="text" ng-model="todoDescription" />
  <button type="submit">Add</button>
</form>
<ul>
  <li ng-repeat="todo in todos | keyFilter | orderBy:'$name'">{{ todo.description }}</li>
</ul>
```

Sort a $goQuery results model. The keyFilter will take the unordered data from
the goQuery model object and sort them based on the ordered `$$index` array;

```js
chatApp.controller('TodoCtrl', function($scope, $goQuery) {
  $scope.todos = $goQuery('todos', { complete: false, sort: { '$name': 'desc' } });
  $scope.todos.$sync();

  $scope.addTodo = function() {

    var todo = {
      description: $scope.todoDescription,
      complete: false
    };

    $scope.todos.$add(todo).then(function() {
      $scope.todoDescription = '';
    });
  };
});
```

```html
<form ng-submit="addTodo()">
  <input type="text" ng-model="todoDescription" />
  <button type="submit">Add</button>
</form>
<ul>
  <li ng-repeat="todo in todos | keyFilter">{{ todo.description }}</li>
</ul>
```