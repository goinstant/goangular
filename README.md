[![Build Status](https://travis-ci.org/goinstant/goangular.png?branch=master)](https://travis-ci.org/goinstant/goangular?branch=master)

[![GoAngular](https://developers.goinstant.com/v1/GoAngular/static/images/goangular_logo.png)](https://www.goangular.org)

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

## Contributing

### Development Dependencies

- [node.js](http://nodejs.org/) >= 0.8.0
- [gulp installed globally](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started)
  - `$ npm install -g gulp`

### Set-Up

The following assumes that you have already installed the dependencies above.

```
git clone https://github.com/goinstant/goangular.git
cd goangular
npm install
```

#### Building GoAngular for Development

GoAngular is built using [browserify](http://browserify.org/).

For convenience, we've included a number of simple gulp commands:

| *default task*:   `$ gulp` |
| --- |
| Removes `build` & `dist` directories |
| Browserify `lib` & `index.js` to `build` directory as `build.js` |
| Start [LiveReload](http://livereload.com/) & watch directories, re-build on change |
| Serve static assets via. [Harp](http://harpjs.com/) & open `/example/index.html` on port `5000` in Chrome |

| *develop task*:   `$ gulp develop` |
| --- |
| Removes `build` & `dist` directories |
| Browserify `lib` & `index.js` to `build` directory as `build.js` |

| *test task*:   `$ gulp test` |
| --- |
| Start [Karma test-runner](http://karma-runner.github.io/0.12/index.html), you'll need [PhantomJS](http://phantomjs.org/) |

If this command runs successfully you'll now have a `build`
directory in your Git repo root.

### Running Example

This will open up an example of GoAngular at work, using your local build.

You should have run `$ gulp develop` or `$ gulp` already.

#### 1. Copy the example config.

```
$ cp config/config.example.js config/config.js
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
$ open examples/index.html
```
