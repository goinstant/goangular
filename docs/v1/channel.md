# $goChannel

```
Stability: 1 - Experimental
```

The `$goChannel` service has only a single required parameter, a `channelName`.
Channels are really useful for sending and receiving messages (scoped to a room).

You can find further documentation on the [Channel](../channel/index.md) page.

## Contents

1. [Code Example](#code-example)
2. [$goConnection#$connect](#$goconnection#$connect)
3. [$goConnection#$set](#$goconnection#$set)
4. [$goConnection#$ready](#$goconnection#$ready)

## TLDR Code Example: Creating & Using a Channel

```js
// Specify GoAngular as a module dependency
angular.module('yourApp', ['goangular'])

  // Configure your GoInstant Connection
  .config(function($goConnectionProvider) {
    $goConnectionProvider.$set('https://goinstant.net/YOURACCOUNT/YOURAPP');
  })

  // Inject $goChannel into your controller
  .controller('yourController', function($goChannel) {
    var channel = $goChannel('/a/channel');

    channel.$message({ time: Date.now(), msg: 'hi'}).then(function(err) {
      // The message was sent!
    });

    channel.$on('message', function(msg) {
      // received a msg from another user
    });
  });
```


