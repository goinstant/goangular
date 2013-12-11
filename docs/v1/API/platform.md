# platform

## Description

GoAngular requires a connection to GoInstant. `platformProvider` enables you
to configure that connection during the AngularJS configuration stage.

### Methods

- ###### **platform.setup(connectUrl)**
- ###### **platform.setup(connectUrl, optionsObject)**

### Parameters

| connectUrl |
|:---|
| Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| Your registered application URL (e.g. https://goinstant.net/YOURACCOUNT/YOURAPP). |

| optionsObject |
|:---|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| An object with the following properties: |
| - `rooms` [**default: ['lobby']**] are the names of the [rooms](../../javascript_api/rooms/index.md) you wish to join upon successfully connecting to GoInstant. __This room will be joined by default__. |
| - `user` [**default: null**] is a [JWT](../../guides/users_and_authentication.md) user token, used to authenticate a user. If this token is not provided the user will be connected as a guest. |

### TL;DR Example
```js
// Configure our platform service
app.config(function(platformProvider) {
  platformProvider.setup('https://goinstant.net/YOURACCOUNT/YOURAPP');
});
```

### Example
```js
<!DOCTYPE html>
<html ng-app="GoAngularExample">
  <head>
    <title>GoAngular Platform Provider Example</title>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script>
    <script src="https://cdn.goinstant.net/v1/platform.min.js"></script>
    <script src="https://cdn.goinstant.net/integrations/goangular/latest/goangular.min.js"></script>
    <script>
      // Create our AngularJS application module & require the goinstant module
      var app = angular.module('GoAngularExample', ['goinstant']);

      // The provider will join this room for us
      var connectUrl = 'https://goinstant.net/YOURACCOUNT/YOURAPP';
      var rooms = ['exampleRoom', 'exampleRoomTwo'];

      // Configure our connection with the platformProvider
      app.config(function(platformProvider) {
        platformProvider.set(connectUrl, { rooms: rooms });
      });

      // We could even use GoInstant directly in our controller!
      app.controller('completeControl', function($scope, platform) {

        // platform is a promise, resolved once a connection is established
        platform.then(

        // We're successfully connected
        function(platform) {
          console.log('Connected to GoInstant!');

          // We've already joined this room because we specified it in
          // our configuration
          var yourRoom = platform.rooms['exampleRoom'];

          function myListener(user) {
            console.log('A new user, "' + user.displayName + '", joined the room');
          }

          yourRoom.on('join', myListener, function(err) {
            if (err) {
              // unable to deregister. clean up or retry.
            }
            // myListener is now set up to recieve events
          });
        }, function(err) {
          console.error('Could not connect to platform', err);
        });
      });
    </script>
  </head>
  <body>
    <div ng-controller="completeControl"></div>
  </body>
</html>
```
