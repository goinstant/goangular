# GoAngular#constructor

## Description

Creates an instance of the GoAngular class.  Accepts an object containing values to initialize
the newly instantiated object with. The instance of `GoAngular` can then be used to begin
synchronization of the Angular [models](http://docs.angularjs.org/guide/concepts#model) in a
specific scope between clients.

An Angular application might contain dozens of controllers, each controller could create a new instance of GoAngular, that instance would be responsible for managing synchronization for that controller alone.

*Note: You must configure your GoInstant connection with the `platform` service prior to creating a new instance of GoAngular*

## Methods

- ###### **new GoAngular($scope, namespace)**
- ###### **new GoAngular($scope, namespace, optionsObject)**

## Parameters

| $scope |
|:---|
| Type: [angular scope](http://docs.angularjs.org/guide/scope) |
| An Angular [`$scope`](http://docs.angularjs.org/guide/scope) object passed to the controller in which the instance is being constructed. |

| namespace |
|:---|
| Type: [angular scope](http://docs.angularjs.org/guide/scope) |
| `namespace` is the name of the [key](../../guides/retrieving_and_setting_keys.md) you wish to use to use to uniquely identify the data in this Angular controller or service |

| optionsObject |
|:---|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| An object with the following properties: |
| - `room` [**default: 'lobby'**] is the name of the [room](../../javascript_api/rooms/index.md) you wish to use to propagate data. __This room must have been previously joined__. |
| - `include` [**default: all valid models in scope**] is an array of strings or RegExp objects representing the models you wish to propagate. |
| - `exclude` [**default: null**] is an array of strings or RegExp objects representing the models you want explicitly excluded from synchronization. A model that is both included and excluded will be excluded. |

## Example

```js
// Create a new Angular controller and inject GoAngular
app.controller('YOURCONTROLLERNAME', function($scope, GoAngular) {
  // Create a new instance of GoAngular
  var goAngular = new GoAngular($scope, 'YOURCONTROLLERNAME', {
    include: [/todo.*/], // Only include models with the a name starting with todo
    exclude: ['newTodo'] // Explicitly exclude the model with the name newTodo
  });
});
```
