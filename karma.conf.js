// Karma configuration
// Generated on Mon Jun 10 2013 09:57:07 GMT-0500 (CDT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'browserify'],


    // list of files / patterns to load in the browser
    files: [
      'tests/*.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // cli runner port
    runnerPort: 9100,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,

    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [ 'Chrome', 'PhantomJS' ],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    // Browserify config (all optional)
    browserify: {
      // extensions: ['.coffee'],
      // ignore: [],
      // transform: ['coffeeify'],
      // debug: true,
      // noParse: ['jquery'],
      watch: true,
    },

    // Add browserify to preprocessors
    preprocessors: {'tests/*': ['browserify']}

  });
};
