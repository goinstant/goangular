/*jshint node:true*/
'use strict';

var path = require('path');
require('js-yaml');

var CLEAN_DIRS = [
  'components',
  'dist',
  'build'
];

var BROWSERS = require('./node_modules/browsers-yaml/browsers');

var ASSET_HOST = process.env.ASSET_HOST;

module.exports = function(grunt) {
  var DIST_OUTPUT_PATH = path.join(__dirname, 'dist');
  var COMPONENT_BIN_PATH = path.join(__dirname,
                                     'node_modules/component/bin/component');

  var UGLIFY_BIN_PATH = path.join(__dirname,
                                  'node_modules/uglify-js/bin/uglifyjs');

  function getSemver() {
    return require('./component').version;
  }

  function getName() {
    return require('./component').name;
  }

  function getSemverURLPath() {
    return ASSET_HOST + '/integrations/goangular/v' + getSemver();
  }

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-saucelabs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-conventional-changelog');

  grunt.initConfig({
    clean: CLEAN_DIRS,
    connect: {
      server: {
        options: {
          base: '',
          port: 9999
        }
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: ['http://localhost:9999/tests/index.html'],
            tunnelTimeout: 5,
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 8,
          browsers: BROWSERS,
          testname: 'GoAngular Unit Tests',
          tags: ['master', 'goangular']
        }
      }
    },
    watch: {
      src: {
        files: ['lib/*.js', 'index.js', 'component.json'],
        tasks: ['component:build:dev']
      },
      reload: {
        files: ['build/*.js', 'examples/**/*.js'],
        options: {
          livereload: true
        }
      }
    },
    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    }
  });

  grunt.registerTask('test', ['build', 'connect', 'saucelabs-mocha']);

  grunt.registerTask('watch' ['watch']);

  // Jshint default task
  grunt.registerTask('build', [
    'clean',
    'component:install',
    'component:build:dev'
  ]);

  grunt.registerTask('build:prod', [
    'clean',
    'component:install',
    'component:build:prod',
    'minify'
  ]);

  grunt.registerTask('component:install', function() {
    var done = this.async();

    var install = {
      cmd: COMPONENT_BIN_PATH,
      args: [ 'install', '-d' ]
    };

    // Build the component.

    grunt.log.writeln('component install - start');
    grunt.util.spawn(install, function(err) {
      if (err) {
        return done(err);
      }

      grunt.log.writeln('component install - done');

      done();
    });
  });

  grunt.registerTask('component:build:dev', function() {
    var done = this.async();

    var args = ['build', '-c', '-d'];

    var build = {
      cmd: COMPONENT_BIN_PATH,
      args: args
    };

    // Build the component.
    grunt.util.spawn(build, function(err) {
      if (err) {
        return done(err);
      }

      done();
    });
  });

  grunt.registerTask('component:build:prod', function() {
    var done = this.async();

    // To prevent having to write a custom build.js file, we take advantage
    // of their lack of escaping in order to build up the widgets namespace.

    // Yeah, this is hacky.
    // In the following code string's context, `this` is the window object.
    var exportName = '"];' +
      'this.goinstant = this.goinstant || {};' +
      'this.goinstant.integrations = this.goinstant.integrations || {};' +
      'this.goinstant.integrations["GoAngular';

    var prefix = getSemverURLPath();

    var args = [
      'build', '-c',
      '-n', getName(),
      '-s', exportName,
      '-o', DIST_OUTPUT_PATH,
      '-p', prefix
    ];

    var build = {
      cmd: COMPONENT_BIN_PATH,
      args: args
    };

    // Build the component.
    grunt.util.spawn(build, function(err) {
      if (err) {
        return done(err);
      }

      done();
    });
  });

  grunt.registerTask('minify', function() {
    var done = this.async();

    var componentDir = DIST_OUTPUT_PATH;

    var jsFilePath = path.join(componentDir, getName() + '.js');
    var minJsFilePath = path.join(componentDir, getName() + '.min.js');

    var uglify = {
      cmd: UGLIFY_BIN_PATH,
      args: [
        '-o',
        minJsFilePath,
        jsFilePath
      ]
    };

    grunt.util.spawn(uglify, done);
  });
};
