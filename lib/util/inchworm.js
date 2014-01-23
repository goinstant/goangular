/* jshint browser:true */
/* global require, module */

'use strict';

var _ = require('lodash');

module.exports = Inchworm;

window.iw = { models: {} };

function Inchworm(model) {
  window.iw.models[model.$$key.name] = model;

  _.extend(this, {
    $$model: model,
    $$name: model.$$key.name,
    $$performance: window.performance,
    $$measures: {
      $add: [],
      $set: [],
      $remove: [],
      $sync: []
    },
    $$totals: {
      $add: 0,
      $set: 0,
      $remove: 0,
      $sync: 0
    },
    $$counter: {
      $add: 0,
      $set: 0,
      $remove: 0,
      $sync: 0
    }
  });

  _.extend(model, {
    $profiler: _.bind(this.$profiler, this)
  });
}

Inchworm.prototype.$profiler = function(command) {
  if (!command) {
    return this.$$measures;
  }

  return this.$$measures[command];
};

Inchworm.prototype.mark = function(command) {
  var markName = [
    this.$$name,
    command,
    this.$$counter[command]++
  ].join('_');

  this.$$performance.mark(markName + '_start');

  var self = this;
  return function() {
    self.$$performance.mark(markName + '_stop');
    self.$$performance.measure(
      markName + '_measure',
      markName + '_start',
      markName + '_stop'
    );

    self.calculate(command, markName + '_measure');
  };
};

Inchworm.prototype.calculate = function(command, markName) {
  var entry = window.performance.getEntriesByName(markName)[0];

  this.$$measures[command].push(entry);
  this.$$totals[command] = _.reduce(this.$$measures[command], function(a, b) {
    return a + b.duration;
  }, 0);
};