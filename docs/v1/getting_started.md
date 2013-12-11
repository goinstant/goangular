# Getting Started

GoAngular represents the intersection between GoInstant (our real-time
backend) & Angular (a client-side framework created by Google).

## Build an app in 3 simple steps

Follow the guide below to build your first  GoAngular app: a multi-user,
real-time synchronized form!

**First, you’ll need to [sign up](http://goinstant.com/signup). Don’t worry, we’ll wait…**

(Please make sure you verify your email address, otherwise you won’t be able to connect to GoInstant.)

### Step 1: Create the form

Let's spin up an Angular powered form:

```html
<!DOCTYPE html>
<html ng-app="FormSync">
  <head>
    <title>GoAngular Form Synchronization</title>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script>
  </head>
  <body>
    <div ng-controller="SyncCtrl">
      <input ng-model="name" type="text"/>
      <br>
      <p>Name is: {{ name }}</p>
    </div>
    <script>
      angular.module('FormSync', []);

      function SyncCtrl($scope) {
        $scope.name = '';
      }
    </script>
  </body>
</html>
```

### Step 2: Connect to GoInstant

Now, we'll include our GoInstant & GoAngular libraries in the `<head>` tag of our Form:

```html
<script src="https://cdn.goinstant.net/v1/platform.min.js"></script>
<script src="https://cdn.goinstant.net/integrations/goangular/latest/goangular.min.js"></script>
```

Next we'll specify the `goinstant` module as a dependency for our app and
configure our connection with the plaform service (`platformProvider`):

```js
angular.module('FormSync', ['goinstant']).
  config(function(platformProvider) {
    platformProvider.set('https://goinstant.net/YOURACCOUNT/YOURAPP');
  });
```

### Step 3: Make it multi-user with GoAngular

Now we add `GoAngular` to our controller, create a new instance and initialize it!
We pass in our controllers $scope and choose a namespace.

```js
function SyncCtrl($scope, GoAngular) {
  $scope.name = 'Bob';

  var goAngular = new GoAngular($scope, 'SyncCtrl');

  // Begin synchronization
  goAngular.initialize();
}
```

#### All Together Now

In only 35 lines of code we have a real-time, multi-user form!

```html
<!DOCTYPE html>
<html ng-app="FormSync">
  <head>
    <title>GoAngular Form Synchronization</title>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script>
    <script src="https://cdn.goinstant.net/v1/platform.min.js"></script>
    <script src="https://cdn.goinstant.net/integrations/goangular/latest/goangular.min.js"></script>
  </head>
  <body>
    <div ng-controller="SyncCtrl">
      <input ng-model="name" type="text"/>
      <br>
      <p>Name is: {{ name }}</p>
    </div>
    <script>
      angular.module('FormSync', ['goinstant']).
        config(function(platformProvider) {
          platformProvider.set('https://goinstant.net/YOURACCOUNT/YOURAPP');
        });

      function SyncCtrl($scope, GoAngular) {
        $scope.name = 'Bob';

        var goAngular = new GoAngular($scope, 'SyncCtrl');

        goAngular.initialize();
      }
    </script>
  </body>
</html>
```
