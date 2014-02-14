/* globals module */

'use strict';

var config = {
  sessionsSecret: 'RTFYAHGS&*IIO!@THJASD&U!H@RIUYAKSFIOJKASF!SAD',
  defaultGoangular: "local",
  defaultPlatform: "production",
  platform: {
    production: {
      cdn: "https://cdn.goinstant.net/v1/platform.min.js",
      connectUrl: "https://goinstant.net/YOUR_ACCOUNT/YOUR_APP",
      appSecret: "YOUR_SECRET",
    }
  },
  goangular: {
    local: "../build.js",
    production: "https://cdn.goinstant.net/integrations/goangular/latest/goangular.js"
  }
};

module.exports = config;
