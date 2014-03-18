/*jshint node:true*/

'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'browserify'],
    files: ['tests/*.js'],
    reporters: ['progress'],
    port: 9876,
    runnerPort: 9100,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR
    // || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,
    autoWatch: true,
    // Start these browsers, currently available:
    // - Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS, IE
    browsers: [ 'Chrome', 'PhantomJS' ],
    captureTimeout: 60000,
    singleRun: false,
    browserify: { watch: true },
    preprocessors: {'tests/*': ['browserify']}
  });
};
