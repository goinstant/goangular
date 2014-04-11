# Key Models and Filtering

The GoAngular key example demonstrates how to use [$goKey](../key.md) and [keyFilter](../key_filter.md)
to model and organize your data in a simple question and answer style app.

The full source of this example can be found [here](https://github.com/colinmacdonald/goangular-key-example).

## Table of Contents

1. [Install](#1.-install)
2. [Set up view](#2.-set-up-view)
3. [Configure GoAngular and set up routes](#3.-configure-goangular-and-set-up-routes)
4. [Main controller](#4.-main-controller)
5. [Ask controller](#5.-ask-controller)
6. [Question controller](#6.-question-controller)
7. [Comment directives](#7.-comment-directives)
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

Next, we define our app and main controller in the view. We also set up links in
the navigation bar for switching between views.

For a guide on `$goUsers` and `users.$local` checkout the [Users and Authentication example](./auth.md).

```html
<body ng-app="keyExample">
  <div ng-controller="mainCtrl">
    <div class="navbar navbar-default navbar-static-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="https://developers.goinstant.com/v1/GoAngular/examples/key.html">GoAngular Key Example</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><a href="#/recent">Recent</a></li>
            <li><a href="#/ask">Ask</a></li>
            <li><a href="#/search">Search</a></li>
          </ul>
          <p class="nav navbar-right navbar-text">{{users.$local.displayName}}</p>
        </div>
      </div>
    </div>
    <div class="container">
      <div ng-view></div>
    </div>
  </div>
</body>
```

### 3. Configure GoAngular and set up routes

First create the Angular app with our `ngRoute` and `goangular`
dependencies, then we configure it with our GoInstant `connectUrl`.

```js
var app = angular.module('keyExample', ['ngRoute', 'goangular']);

app.config(['$routeProvider', '$goConnectionProvider',
  function($routeProvider, $goConnectionProvider) {
    var url = window.connectUrl || 'YOUR_CONNECT_URL';

    $goConnectionProvider.$set(url);

    $routeProvider
      .when('/recent', {
        templateUrl: 'views/recent.html',
        controller: 'recentCtrl'
      })
      .when('/ask', {
        templateUrl: 'views/ask.html',
        controller: 'askCtrl'
      })
      .when('/question/:id', {
        templateUrl: 'views/question.html',
        controller: 'questionCtrl'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'searchCtrl'
      })
      .otherwise({
        redirectTo: '/recent'
      });
  }
]);
```

### 4. Main controller

Our main controller is very simple in this example. It simply puts our questions
model and `$local` user's model on scope.

```js
app.controller('mainCtrl', function($scope, $goKey, $goUsers) {
  $scope.questions = $goKey('questions').$sync();

  $scope.users = $goUsers();
  $scope.users.$self();
});
```

The recent view's controller will be very basic, so lets define that as well.

```js
app.controller('recentCtrl', function($scope) {
  $scope.title = 'Recent Questions';
});
```

### 5. Ask controller

The ask controller will handle a new question being submitted. The controller
simply assembles the data we wish to store in GoInstant on a `question` object,
then performs an [$add](../model/key_model/add.md) on our root `questions` key.
Once the `$add` operation completes we redirect the user to the newly created
question page.

```js
app.controller('askCtrl', function($scope, $location, $timeout) {
  $scope.title = 'Ask a Question';
  $scope.buttonText = 'Ask!';

  $scope.ask = function() {
    $scope.buttonText = 'Loading...';

    var question = {
      title: $scope.questionTitle,
      body: $scope.questionBody,
      user: $scope.users.$local.displayName
    };

    $scope.questionTitle = '';
    $scope.questionBody = '';

    $scope.questions.$add(question).then(function(result) {
      var id = result.context.addedKey.split('/').pop();

      $timeout(function() {
        $location.path('/question/' + id);
        $scope.buttonText = 'Ask!';
      }, 500);
    });
  };
});
```

### 6. Question controller

In the question controller we put the question's comments model on
`$scope`, then extend it with a method for posting a new comment. The `$post`
method calls [$add](../model/key_model/add.md) to store the comment in
GoInstant, then clears the input box if the `$add` was successful.

```js
app.controller('questionCtrl', function($scope, $routeParams, $timeout, $goKey) {
  $scope.id = $routeParams.id;

  $scope.comments = $goKey('comments').$key($scope.id).$sync();

  $scope.comments.$post = function() {
    var comment = {
      body: $scope.newComment,
      user: $scope.users.$local.displayName,
      userId: $scope.users.$local.id
    };

    $scope.comments.$add(comment).then(function() {
      $scope.newComment = '';
    });
  };
```

Next we add a listener for when a new comment is added to the comments model.
We use this to display a "New Comment" notification for 2 seconds.

```js
  var timeoutId = null;

  $scope.comments.$on('add', { local: true }, function() {
    $scope.notification = true;

    $timeout.cancel(timeoutId);

    timeoutId = $timeout(function() {
      $scope.notification = false;
      timeoutId = null;
    }, 2000);
  });
```

Finally, we call [$off](../model/key_model/off.md) on the question's comments
model to both desynchronize it and remove our `add` listener. This is simply a
clean-up operation so we are not receiving unnecessary data while in a different
view.

```js
  $scope.$on('$destroy', function() {
    $scope.comments.$off();
  });
});
```

### 7. Comment directives

Question comments are split into two directives. The `comments` directive is
used as the interface for creating the comments list and is the parent of the
`comment` directive.

```js
app.directive('comments', function() {
  return {
    scope: {
      comments: '=',
      localUser: '=localUser'
    },
    restrict: 'A',
    templateUrl: 'templates/comments.html'
  };
});
```

##### Comments template:

```html
<ul class="list-unstyled list comments">
  <li ng-repeat="comment in comments | keyFilter | orderBy:'$name'">
    <comment></comment>
  </li>
</ul>
```

The comment directive handles the interface for individual comment operations,
such as editing or deleting a comment.

Given the `id` of the comment we can edit its message by calling [$set](../model/key_model/set.md)
on the `body` key to overwrite its current value to the value of
`$scope.editText`. Similarly, we call [$remove](../model/key_model/remove.md)
on the comment key to delete the message in GoInstant.

```js
app.directive('comment', function($goKey) {
  return {
    restrict: 'E',
    templateUrl: 'templates/comment.html',
    require: '^comments',
    controller: function($scope) {
      $scope.editButton = 'Edit';

      $scope.comment.$edit = function(id) {
        if ($scope.editButton === 'Edit') {
          $scope.editButton = 'Submit';

        } else {
          var commentBody = $scope.comments.$key(id).$key('body');

          commentBody.$set($scope.editText).then(function() {
            $scope.editText = '';
            $scope.editButton = 'Edit';
          });
        }
      };

      $scope.comment.$delete = function(id) {
        $scope.comments.$key(id).$remove();
      };
    }
  };
});
```

##### Comment template:

```html
<span class="comment-text">
  <input type="text" class="edit-box" enter="comment.$edit(comment.$name)" ng-hide="editButton === 'Edit'" ng-model="editText" />
  <span ng-hide="editButton === 'Submit'">{{comment.body}} - {{comment.user}}</span>
</span>
<span class="comment-edit" ng-show="comment.userId === localUser">
  <a ng-click="comment.$edit(comment.$name)">{{editButton}}</a>
  <a ng-click="comment.$delete(comment.$name)">Delete</a>
</span>
```

### 8. Views

Now that we have our controllers and directives implemented, we can set up our
four views.

##### Recent view

The recent view iterates over all questions. Using the [keyFilter](../key_filter.md)
the questions model is converted into an array, which can be sorted limited to
display the ten most recently asked questions.

```html
<div class="jumbotron">
  <h2>{{title}}</h2>
  <ul class="list-unstyled list questions">
    <li ng-repeat="question in questions | keyFilter | orderBy:'-$name' | limitTo:10">
      <a href="#/question/{{question.$name}}">Q: {{question.title}}</a>
      <p class="list-text">{{question.body}}</p>
    </li>
  </ul>
</div>
```

##### Ask view

The ask view has a number of inputs for creating a new question.

```html
<div class="jumbotron">
  <h2>{{title}}</h2>
  <p>Ask your question below!</p>
  <input class="input question-title" ng-model="questionTitle" />
  <textarea class="input question-body" ng-model="questionBody"></textarea>
  <button class="submit" ng-click="ask()">{{buttonText}}</button>
</div>
```

##### Search view

Similar to the [recent view](#recent-view), the search view displays the top 10
search results given the search terms.

```html
<div class="jumbotron">
  <h2>{{title}}</h2>
  <input class="input" ng-model="searchTerms" />
</div>
<ul class="list-unstyled list questions">
  <li ng-repeat="question in questions | keyFilter | filter:searchTerms | orderBy:'-$name' | limitTo:10">
  <a href="#/question/{{question.$name}}">Q: {{question.title}}</a>
  <p class="list-text">{{question.body}}</p>
  </li>
</ul>
```

##### Question view

The question view handles display the data retrived from GoInstant given a
question `id`. It also provides the interface for commenting on a question using
the [comment directives](#7.-comment-directives) that we created in **step 7**

```html
<div class="jumbotron">
  <h2>{{questions[id].title}}</h2>
  <p>{{questions[id].user}}</p>
  <p>{{questions[id].body}}</p>
</div>
<div class="container">
  <h4 class="comments-header">{{(comments | keyFilter).length}} Comments</h4>
  <span class="notification" ng-show="notification">New Comment</span>
  <div comments="comments" local-user="users.$local.id"></div>
  <div>
    <h4>New Comment</h4>
    <input class="input new-comment" enter="comments.$post()" ng-model="newComment" />
    <button class="submit post" ng-click="comments.$post()">Post!</button>
  </div>
</div>
```

### Conclusion

We created a simple "question and answer" app which handles storing, filtering,
structuring, and manipulating data using [$goKey](../key.md). We encourage you
to run the example locally, try populating the app with some data, and
experiment with the code.

Using the concepts covered in this example you are now ready to start writing
your own GoAngular app using [$goKey](../key.md) and the [keyFilter](../key_filter.md).
