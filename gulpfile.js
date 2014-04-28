/* jshint node:true */

'use strict';

var harp = require('harp');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var pathTo = {
  clean: ['build/', 'dist/'],
  watch: ['lib/**.js', 'index.js'],
  watchBuild: 'build/build.js',
  tests: ['tests/*.js'],
  entry: 'index.js',
  build: 'build/',
  dist: 'dist/'
};

gulp.task('clean', function() {
  gulp.src(pathTo.clean, { read: false }).pipe(plugins.clean({ force: true }));
});

gulp.task('lint', function() {
  gulp.src(pathTo.watch)
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(pathTo.build));
});

gulp.task('develop', ['clean'], function() {
  gulp.src(pathTo.entry)
    .pipe(plugins.browserify())
    .pipe(plugins.rename('build.js'))
    .pipe(gulp.dest(pathTo.build));
});

gulp.task('build', ['clean', 'develop'], function() {
    gulp.src(pathTo.entry)
    .pipe(plugins.browserify())
    .pipe(plugins.rename('goangular.js'))
    .pipe(gulp.dest(pathTo.dist))
    .pipe(plugins.uglify())
    .pipe(plugins.rename('goangular.min.js'))
    .pipe(gulp.dest(pathTo.dist));
});

gulp.task('test', function() {
  return gulp.src(pathTo.tests)
    .pipe(plugins.karma({
      configFile: 'karma.conf.js',
      browsers: ['PhantomJS'],
      action: 'run'
    }))
    .on('error', throwErr);
});

gulp.task('tdd', function() {
  return gulp.src(pathTo.tests)
    .pipe(plugins.karma({
      configFile: 'karma.conf.js',
      action: 'start'
    }))
    .on('error', throwErr);
});

gulp.task('default', ['clean', 'develop'], function() {
  harp.server(__dirname, { port: 5000 });

  var options = {
    url: 'http://localhost:5000/examples/',
    app: 'Google Chrome'
  };

  gulp.src('./examples/index.html')
    .pipe(plugins.open('', options))
    .pipe(gulp.dest(pathTo.dist));

  gulp.watch(pathTo.watch).on('change', function() {
    gulp.start('develop');
  });

  var livereload = plugins.livereload();
  gulp.watch(pathTo.watchBuild).on('change', function(file) {
    livereload.changed(file.path);
  });
});

function throwErr(err) {
  throw err;
}
