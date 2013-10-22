[![Build Status](https://magnum.travis-ci.com/goinstant/goangular.png?token=Fu8YhdpouoYjxK6Dqepx&branch=v1.0.0)](https://magnum.travis-ci.com/goinstant/goangular)

[![GoAngular](https://developers.goinstant.com/beta/static/images/goangular/goangular_logo.png)](https://developers.goinstant.com/v1/GoAngular/index.html)

[GoAngular](https://developers.goinstant.com/v1/GoAngular/index.html) is an
open source integration of [GoInstant](https://goinstant.com) with
[AngularJS](http://angularjs.org/). GoAngular is officially supported by GoInstant.

Build realtime, collaborative applications quickly and easily.

You can learn more in our
[tutorial](https://developers.goinstant.com/v1/GoAngular/getting_started.html),
and
[documentation](https://developers.goinstant.com/v1/GoAngular/index.html) or by looking under the hood
of this [todo example](http://goangular-todo-example.herokuapp.com/).

Have questions? We're on IRC. #goinstant on [Freenode](http://freenode.net/).

## Packaging
For your convenience, we've packaged GoAngular in several ways.

#### Using our CDN

We host a copy on our CDN. Have a look at the [docs](https://developers.goinstant.com/v1/GoAngular/index.html)
to see how to reference those files, as well as how to initialize the component

#### How do I build the script myself?

You may have your own build process. We've tried to make it easy to include
GoAngular in your build process.

#### Bower

We've packaged GoAngular as a [bower](http://bower.io/) component.

```
bower install goangular
```

#### Component

We've packaged GoAngular as a [component](http://component.io/).

```
component install goangular
```

## Contributing

### Development Dependencies

- [node.js](http://nodejs.org/) >= 0.8.0
- [grunt-cli installed globally](http://gruntjs.com/getting-started)
  - `npm install -g grunt-cli`

### Set-Up

The following assumes that you have already installed the dependencies above.

```
git clone https://github.com/goinstant/goangular.git
cd goangular
npm install
```

#### Building GoAngular for Development

GoAngular is built as a [component](https://github.com/component/component).
Feel free to manually install dependencies and build using the `component`
command line tool.

For convenience, we've included a simple grunt command for installing
component dependencies and building:

```
grunt build
```

If this command runs succesfully you'll now have `components` and `build`
directories in your Git repo root.

### Running Tests

Tests are written in [mocha](http://visionmedia.github.io/mocha/). They're run
in an [HTML file](http://visionmedia.github.io/mocha/#html-reporter).

Just open the test/index.html file to run the tests.

On Mac OS, you can just run this command to open the HTML Runner in your
default browser:

```
open test/index.html
```

### Running Example

This will open up an example of GoAngular at work, using your local build.

You should have run `grunt build` already.

#### 1. Copy the example config.

```
cp config/config.example.js config/config.js
```

#### 2. Replace the connectUrl with your Platform application's.

If you haven't signed up for GoInstant yet, you can [sign up and create an
application here](https://goinstant.com/signup).

After you have an application's `connectUrl`, put it inside of config.js:

##### config.js

```js
window.CONFIG = {
  connectUrl: 'https://goinstant.net/YOUR_ACCOUNT/YOUR_APP'
};
```

#### 3. Open the example

```
open examples/index.html
```
