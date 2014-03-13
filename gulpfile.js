/*jshint node:true*/

'use strict';

var Q = require('q');
var harp = require('harp');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var pathTo = {
  clean: ['build/', 'dist/'],
  watch: ['lib/**.js', 'index.js'],
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
  var deferred = Q.defer();

  gulp.src(pathTo.entry)
    .pipe(plugins.browserify())
    .pipe(plugins.rename('build.js'))
    .pipe(gulp.dest(pathTo.build))
    .on('end', deferred.resolve);

  return deferred.promise;
});

gulp.task('build:prod', ['clean', 'develop'], function() {
    gulp.src(pathTo.entry)
    .pipe(plugins.browserify())
    .pipe(plugins.rename('goangular.js'))
    .pipe(gulp.dest(pathTo.dist))
    .pipe(plugins.ngmin())
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

gulp.task('default', ['clean', 'develop'], function() {
  harp.server(__dirname, { port: process.env.PORT || 5000 });

  var livereload = plugins.livereload();
  gulp.watch(pathTo.watch).on('change', function(file) {
    gulp.start('develop', function() {
      livereload.changed(file.path);
    });
  });
});

function throwErr(err) {
  throw err;
}