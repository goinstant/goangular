/* jshint node:true */

'use strict';

var config = require('./config.json');
var S3Deploy = require('./lib/s3_deploy');

function deploy() {
  var s3Deploy = new S3Deploy(config);

  s3Deploy.deploy(function(err, success) {
    if (err) {
      console.log('deploy failed!');

      throw err;
    }

    if (success) {
      console.log('deploy successful!');

    } else {
      console.log('no deploy');
    }
  });
}

deploy();


