# Getting Started

GoAngular is a GoInstant-powered data synchronization and storage integration built for Angular. It’s the perfect companion for building realtime, collaborative apps. This tutorial will walk you through creating your first GoAngular application and address the massive shortage of chat applications on the web. (OK, we know there isn’t a shortage of chat apps on the web, but there aren’t any like this! OK, there are...but this uses GoAngular, which is awesome, trust me.)

You can find the source files for this demo (with some slight enhancements) [here](https://github.com/mattcreager/goangular-chat-example), visit the [live demo](http://goangular-chat-example.herokuapp.com/) and [watch the screen cast too](http://www.youtube.com/watch?v=u2jCgJG-zSo)

##  Contents

1. [Sign Up for a GoInstant Account](#sign-up-for-a-goinstant-account)
2. [Install GoAngular](#install-goangular)
3. [Create and Synchronize a Collection of Chat Messages](#create-&-synchronize-a-collection-of-chat-messages)
4. [Add a New Message to Our Collection](#add-a-new-message-to-our-collection)
5. [The Kitchen Sink Demo](#the-kitchen-sink-demo)

## Sign Up for a GoInstant Account

GoAngular requires a GoInstant account. Head over to our [sign up page](https://goinstant.com/signup) and create one (you can use your GitHub account if you have one). Once you’ve signed up, create a new app in your dashboard. Each application has a unique Connect URL (click the app name that you just created to grab it):

`https://goinstant.net/ACCOUNT_NAME/APP_NAME`

We’ll need this later to configure our GoInstant connection.

## Install GoAngular

The simplest way to get started with GoAngular is to include the GoInstant and GoAngular libraries from their respective [CDNs](https://cdn.goinstant.net/), but the [bower](http://bower.io/) and [component.io](http://component.io/) package managers are also supported:

#### CDN

```<script src="https://cdn.goinstant.net/v1/platform.min.js"></script>```

```<script src="https://cdn.goinstant.net/integrations/goangular/latest/goangular.min.js"></script>```

#### Bower

`bower install goangular`

#### Component

`component install goinstant/goangular`

### Register `goangular` as a Dependency

The `goangular` module includes a collection of services, before we can access them from within our application we need to specify the module as a dependency for our new chat app:

```js
var chatApp = angular.module('Chat', ['goangular']);
```

### Configure the GoInstant connection

We'll use the `$goConnection` provider during Angular's configuration stage to set our applications Connect Url:

```js
var chatApp = angular.module('Chat', ['goangular']);

chatApp.config(function($goConnectionProvider) {
  $goConnectionProvider.$set('https://goinstant.net/ACCOUNT_NAME/APP_NAME');
});
```

Now that our connection is configured we can inject the `$goKey` service into a controller:

```js
var chatApp = angular.module('Chat', ['goangular']);

chatApp.config(function($goConnectionProvider) {
  $goConnectionProvider.$set('https://goinstant.net/ACCOUNT_NAME/APP_NAME');
});

chatApp.controller('ChatCtrl', function($scope, $goKey) {
 // $goKey is available
});
```

Congratulations, you've installed GoAngular and we're ready to build our chat application!

## Create & Synchronize a Collection of Chat Messages

The `$goKey` method takes a string, representing the location (or key) within your remote data structure. Our data structure is going to be very simple, it's only going to have one key: `messages`. GoInstant stores data in a JSON schema. Each message will have an author and content. You can imagine it will look like this:

```json
{
  messages: {
    generated_id: {
      author: 'author name',
      content: 'message contents'
    }
  }
}
```

`$goKey` always returns a [Model](./model/index.md), an encapsulation for your application’s data. Each model is associated with a specific location in your data structure and includes methods for manipulating and managing your data.

Let's use `$goKey` to create a model associated with our collection of messages and place it on `$scope`:

```js
chatApp.controller('ChatCtrl', function($scope, $goKey) {
  $scope.messages = $goKey('messages');
});
```

At this point `$scope.messages` is an empty container. We can fill it up with our remote data using the `$sync` method, which will also monitor our remote data, updating our local version whenever it changes. **Note: changes made *directly* to the model object will not persist back to remote storage.**

```js
chatApp.controller('ChatCtrl', function($scope, $goKey) {
  $scope.messages = $goKey('messages');
  $scope.messages.$sync();

  // We can attach a listener to the 'ready' event
  // to be notified when our model is in sync
  $scope.messages.$on('ready', function() {
    // Our local and remote structures are now in sync
  });

  // We can attach a listener to the 'error' event
  // to be notified when a problem occurs
  $scope.messages.$on('error', function() {
    // Uh oh
  });
});
```

## Add a New Message to Our Collection

The `$add` method is really helpful, it generates IDs/Key names for the items we add to our collection. Best of all, the names are generated chronologically, making them easy to sort. We can begin adding messages to our collection before it's finished synchronization:

```js
chatApp.controller('ChatCtrl', function($scope, $goKey) {
  $scope.messages = $goKey('messages');
  $scope.messages.$sync();

  $scope.sendMessage = function() {
    var message = {
      content: $scope.messageContent,
      author: $scope.author
    };

    // Each method returns a promise, we can use that to confirm that item was
    // added succesfully
    $scope.messages.$add(message).then(function() {
      $scope.messageContent = '';
    });
  }
});
```

Each time an item is added, our model is updated, and so is (of course) our view!

## The Kitchen Sink Demo

Let's see it all tied together:

```html
<!DOCTYPE html>
<html ng-app="Chat">
<head>
  <title>GoAngular Chat Tutorial</title>
</head>
<body ng-controller="ChatCtrl">
  <h1>Getting Started with GoAngular Chat</h1>

  <!-- Messages displayed -->
  <div id="messages">
    <div class="message" ng-repeat="message in messages">
      <span class="author">{{ message.author }}</span>
      <span class="content">{{ message.content }}</span>
    </div>
  </div>

  <!-- New message form -->
  <form ng-submit="sendMessage()">
    <input ng-model="author">
    <input ng-model="messageContent">
    <button type="submit">Send</button>
  </form>

  <!-- Dependencies -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.1/angular.min.js"></script>
  <script src="https://cdn.goinstant.net/v1/platform.min.js"></script>
  <script src="https://cdn.goinstant.net/integrations/goangular/latest/goangular.min.js"></script>

  <!-- Angular App -->
  <script>
    var chatApp = angular.module('Chat', ['goangular']);

    chatApp.config(function($goConnectionProvider) {
      $goConnectionProvider.$set('https://goinstant.net/ACCOUNT_NAME/APP_NAME');
    });

    chatApp.controller('ChatCtrl', function($scope, $goKey) {
      $scope.messages = $goKey('messages');
      $scope.messages.$sync();

      $scope.sendMessage = function() {
        var message = {
          content: $scope.messageContent,
          author: $scope.author
        };

        // Each method returns a promise, we can use that to confirm that item was
        // added successfully
        $scope.messages.$add(message).then(function() {
          $scope.messageContent = '';
        });
      }
    });
  </script>
</body>
</html>
```
