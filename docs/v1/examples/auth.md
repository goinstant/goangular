# Users and Authentication

The GoAngular authentication example configures routes with limited access
depending on if the locally connected user is a guest or has "signed in" via
GitHub, Twitter, or Facebook. This example focuses on using the [$goConnection](../connection.md)
provider and the [$goUsers](../users.md) service.

The full source for this example can be found [here](https://github.com/colinmacdonald/goangular-auth-example).

## Table of Contents

1. [Install](#1.-install)
2. [Set up view](#2.-set-up-view)
3. [Configure GoAngular and set up routes](#3.-configure-goangular-and-set-up-routes)
4. [Permissions service](#4.-permissions-service)
5. [Main controller](#5.-main-controller)
6. [Access directive](#6.-access-directive)
7. [Set up menu and login buttons](#7.-set-up-menu-and-login-buttons)
8. [Views](#8.-views)

### 1. Install

First things first, we include all of our dependencies.

```html
<head>
  <title>GoInstant GoAngular Auth Example</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Platform -->
  <script src="https://cdn.goinstant.net/v1/platform.min.js"></script>

  <!-- jQuery -->
  <script src="bower_components/jquery/dist/jquery.min.js"></script>

  <!-- Angular -->
  <script src="bower_components/angular/angular.min.js"></script>
  <script src="bower_components/angular-route/angular-route.min.js"></script>

  <!-- GoAngular -->
  <script src="bower_components/goangular/dist/goangular.min.js"></script>

  <!-- Config -->
  <script src="config/config.js"></script>

  <!-- Example specific -->
  <script src="js/app.js"></script>

  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css" />
  <link rel="stylesheet" href="css/styles.css" />
</head>
```

### 2. Set up view

Next, we define our app and main controller in the view. We also begin
setting up the navigation bar, which will contain our view menu and login links.

```html
<body ng-app="auth">
  <div ng-controller="mainCtrl">
    <div class="navbar navbar-default navbar-static-top">

    </div>
  </div>
</body>
```

### 3. Configure GoAngular and set up routes

First we create the Angular app with our `ngRoute` and `goangular`
dependencies, then we configure it with our GoInstant connectUrl. We also set
our [$loginUrl](../connection.html#$loginUrl) (`GitHub`, `Twitter`, and
`Facebook`) and [$logoutUrl](../connection.html#$logoutUrl), which will generate
links on [$goConnection](../connection.md) for use in the view. Finally, we set
up some basic routes. Note the `access` property we added to the `/profile`
route, we will use this to determine the type of user that is granted access.
Any routes without this property simply don't require any special access
permissions.

```js
var app = angular.module('auth', ['ngRoute', 'goangular']);

app.config(['$routeProvider', '$goConnectionProvider',
  function($routeProvider, $goConnectionProvider) {
    var url = window.connectUrl || 'YOUR_CONNECT_URL';
    var origin = window.location.origin;
    var path = window.location.pathname;
    var returnTo = origin + path;

    $goConnectionProvider.$set(url);
    $goConnectionProvider.$loginUrl(['GitHub', 'Twitter', 'Facebook']);

    $goConnectionProvider.$logoutUrl(returnTo);

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'profileCtrl',
        access: 'authenticated'
      })
      .when('/restricted', {
        templateUrl: 'views/restricted.html',
        controller: 'restrictedCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);
```

For each route, we create a simple controller that can be expanded later.

```js
app.controller('homeCtrl', function($scope) {
  $scope.title = 'Home';
});

app.controller('profileCtrl', function($scope) {
  $scope.title = 'Profile';
});

app.controller('restrictedCtrl', function($scope) {
  $scope.title = 'Restricted';
});
```

### 4. Permissions service

The following service is used to tie a user to an access level. In this
example, an 'authenticated' user is granted access to the `/profile` route. This
 service simply checks if the user `isGuest` and compares those permissions to
the `accessLevel` they are trying to access. If there is a match, the service
returns `true`.

```js
app.factory('permissions', function ($goConnection) {
    return {
      authorized: function(accessLevel) {
        var permission;

        switch ($goConnection.isGuest) {
          case true:
            permission = 'guest';
            break;
          case false:
            permission = 'authenticated';
            break;
          default:
            permission = null;
        }

        if (permission === accessLevel) {
          return true;
        }

        return false;
      }
   };
});
```

### 5. Main controller

Lets start using the routes we configured with the `permissions` service to
grant (or deny) a user access to a view.

Here we put a few models on `$scope` for use in the view. `conn` will
be used to render our login and logout links that we configured in **Step 3**.
The [users](../model/users_model/index.md) model is used to manage both your
local and remote users. In this example, we are only working with the local user
so there's no need to [$sync](../model/sync.md) all of the connected users'
data. Instead, we simply call [$self](../model/users_model/self.md) on the
users model to store and [$sync](../model/sync.md) the local user's model on
`$scope.users.$local`.

Where we need to wait for the user to connect before determining if they can or
 cannot access a particular view, we perform that logic once the connection is
[$ready](../connection.html#$ready).

A listener is registered to `$routeChangeStart`, which will trigger **before**
the view changes. This is where we perform our permissions check by calling
`routeAuthorized`, which uses the `permissions` service we made in **Step 4**.

```js
app.controller('mainCtrl',
  function($scope, $route, $location, $goConnection, $goUsers, permissions) {
    $scope.conn = $goConnection;
    $scope.users = $goUsers();
    $scope.users.$self();

    $goConnection.$ready().then(function() {
      $scope.$on('$routeChangeStart', routeAuthorized);

      function routeAuthorized(scope, next) {
        var route = next || $route.current;
        var accessLevel = route.access;

        if (accessLevel && !permissions.authorized(accessLevel)) {
          $location.path('/restricted');
        }
      }

      routeAuthorized();
    });
  }
);
```

### 6. Access directive

Before we get back to the view, lets make showing and hiding elements a bit
easier with a directive. Similar to how we restrict access to routes using the
`permissions` service, we can also `show()` or `hide` elements based on the
local user's permissions. Where our permissions don't change after being
connected, we only need call the `authenticate` function once the connection
is [$ready](../connection.html#$ready).

```js
app.directive('access', function($goConnection, permissions) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      function authenticate() {
        var accessLevel = attrs.access;

        if (accessLevel && !permissions.authorized(accessLevel)) {
          element.hide();

        } else {
          element.show();
        }
      }

      $goConnection.$ready().then(function() {
        authenticate();
      });
    }
  };
});
```

### 7. Set up menu and login buttons

Time to get back to the view and put our new `access` directive to good use.

The first `<ul>` simply creates our links in the navbar for moving between
views. Note we are using our `access` directive to hide the link to the
`/profile` view.

The second `<ul>` is used to create the login/logout links and display the
user's `displayName`. The `access` directive is used to only show the login if
the user's permissions describe them as a `guest` and the logout if they are
`authenticated`.

As mentioned before, the user's model is accessed off the [users](../model/users_model/index.md)
model using the `$local` property to display their name.

```html
<body ng-app="auth">
  <div ng-controller="mainCtrl">
    <div class="navbar navbar-default navbar-static-top">
      <div ng-show="users.$local.id" class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="http://goinstant.com">GoInstant Auth Example</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><a href="#/">Home</a></li>
            <li><a access="authenticated" href="#profile">Profile</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li ng-show="conn.isGuest"><p class="navbar-text">Sign in with: </p></li>
            <li ng-repeat="provider in conn.loginProviders">
              <a access="guest" href="{{provider.url}}">{{provider.name}}</a>
            </li>
            <li><a access="authenticated" href="{{conn.logoutUrl}}">Sign out</a></li>
            <li><strong class="navbar-text">{{users.$local.displayName}}</strong></li>
          </ul>
        </div>
      </div>
    </div>
```

### 8. Views

We defined our routes in **Step 3**, now lets add the corresponding views.

```html
    <div class="container">
      <div ng-view></div>
    </div>
  </div>
</body>
```

Home view:

```html
<h2>{{title}}</h2>

<p>Welcome!</p>
```

Restricted view:

```html
<h2>{{title}}</h2>

<p>You must sign in to view your profile.</p>
```

Profile view:

Again, we are accessing the `$local` user's data to display their avatar, name,
id, and email (if available).

```html
<h2>{{title}}</h2>

<div class="col-sm-2 col-md-2">
  <img ng-src="{{users.$local.avatarUrl}}" class="img-rounded img-responsive" />
</div>
<div class="col-sm-4 col-md-4">
  <blockquote>
    <p>{{users.$local.displayName}}</p>
    <small><cite title="Source Title">{{users.$local.id}}</cite></small>
    <small ng-show="users.$local.email"><cite title="Source Title">{{users.$local.email}}</cite></small>
  </blockquote>
</div>
```

### Conclusion

That's it! We created an app that handles both authentication and user
permissions without any back-end set up. To test the how the `/profile` route
permissions work, try navigating to `/profile` directly in the browser. As a
guest user the link to that view will not be displayed, instead you will be
redirected to the `restricted` view.

Using the concepts covered in this example you are now ready to start writing
your own GoAngular app using [$goUsers](../users.md) and auth with [$goConnection](../connection.md).
