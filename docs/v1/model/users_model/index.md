# Users Model

A users model is an object created and returned by the [$goUsers](../../users.md) factory.
It encapsulates your application's data and provides an API to access and
persist that data.

The Users Model inherits all of the methods and properties from a Model.

1. [API](#api)
2. [Managing Users' Data](#managing-users'-data)
3. [Local User's Data](#local-user's-data)

## API

| [$key(name)](../key.md)|
|:--|
| Creates a new [key model](../key_model/index.md) instance, with a relative key. |

| [$omit()](../omit.md)|
|:--|
| Returns a new object, sans properties prefixed with `$`. |

| [$sync()](../sync.md)|
|:--|
| Retrieves the current value of the key associated with this model and monitors it for changes, keeping the model in sync with the associated key.  ***Note: changes made directly to the object do not persist back to the key.*** |

| [$self(sync)](./self.md)|
|:--|
| Returns a promise that resolves to a new model, specific to the local user. |

| [$getUser(userId)](./get_user.md)|
|:--|
| Creates a new [key model](../key_model/index.md) instance of the user given their ID. |

| [$on(eventName, opts, handler)](./on.md)|
|:--|
| Adds an event handler. Can be used to monitor local and remote changes to the model. Extends the implementation of [KeyModel#$on](../key_model/on) to allow monitoring of user `join` and `leave` events. |

| [$off(eventName, opts handler)](./off.md)|
|:--|
| Removes an event handler. Extends the implementation of [KeyModel#$off](../key_model/off.md). |

## Managing users' data

The users model works in the same way as a [key model](../key_model/index.md) to
access and persist data, explicitly on the `.users` key. The main difference is
the users model cannot be directly changed through familiar key operations
(#$set, #$add, #$remove). Instead, the model is automatically updated when a
user joins or leaves the [GoInstant room](../javascript_api/rooms/index.html).

### Listening for changes

All events available on [key model]('../key_model/index.md') are also
available on the users model. However, where the users model cannot be directly
changed, all key events will be [bubbling]() listeners. These listeners will
trigger when a user's [userObject]() has changed.

*Note that the `bubble: true` option does not need to be set, the users model
assumes all key listeners to be bubbling listeners.*

A common use of bubbling listeners is to listen for changes to users'
displayNames:

```js
angular.module('yourApp').controller('usersCtrl', function($scope, $goUsers) {
  $scope.users = $goUsers();

  $scope.users.$on('set', { local: true }, function(value, context) {
    console.log(context.userId + ' changed their name to ' + value);
  });
});
```

The users model adds two new events to register listeners for, `join`, `leave`.
These events will trigger when a user joins the room, or leaves a room.

```js
angular.module('yourApp').controller('usersCtrl', function($scope, $goUsers) {
  $scope.users = $goUsers();

  $scope.users.$on('join', function(user) {
    console.log(user.displayName + ' has joined.');
  });

  $scope.users.$on('leave', function(user) {
    console.log(user.displayName + ' has left.');
  });
});
```

### Managing a specific user's data

If a user is of particular interest you can create a [key model]() of that
user's data using the `#$getUser(id)` method.

```js
angular.module('yourApp').controller('usersCtrl', function($scope, $goUsers) {
  $scope.users = $goUsers();

  $scope.someUser = $scope.users.$getUser('some-user-id').$sync();
});
```

## Local User's Data

The users model can also be used to create a [key model]() of the locally
connected user. Unlike other keys, the local user's [key model]() can only be
created after being connected to GoInstant. The reason for this is we must be
connected to GoInstant before we are assigned a user Id, which is the name of the
key that represents the local user.

The local user's model is created by calling `$self` on the user model and
accessed via the `$local` property. `$self` will automatically call `$sync` on
the local user's [key model]() so `$sync` can be a synchronous call. `$self`
will return a promise and resolve it once the model is available at `$local` and
synchronized.

The following example will put the local user's [key model]() on scope at
`users.$local` once you are connected, joined to the room, and synchronized.

```js
angular.module('yourApp').controller('usersCtrl', function($scope, $goUsers) {
  $scope.users = $goUsers();
  $scope.users.$self();
});
```

```html
<div ng-controller="usersCtrl">
  <span>{{users.$local.displayName}}</span>
</div>
```

If your application requires you to manipulate data on the local user's [key model]()
prior to it being synchronized you can pass `false` to `$self`, which prevents
`$sync` from being called automatically. In this case, the promise returned by
`$self` will resolve only once the model is available on `$local`.

```js
angular.module('yourApp').controller('usersCtrl', function($scope, $goUsers) {
  $scope.users = $goUsers();

  $scope.users.$self(false).then(function(model) {
    model.$key('displayName').$set('My Name');
    model.$sync();
  });
});
```

```html
<div ng-controller="usersCtrl">
  <span>{{users.$local.displayName}}</span>
</div>
```

If you only care about putting the local user's model on scope you can do so by
calling `$self` directly on `$goUsers()` and setting the scope in the promise.

```js
angular.module('yourApp').controller('usersCtrl', function($scope, $goUsers) {
  $goUsers().$self().then(function(model) {
    $scope.self = model;
  });
});
```
