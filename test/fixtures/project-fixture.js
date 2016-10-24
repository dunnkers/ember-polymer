/* jshint node: true */
'use strict';

module.exports = {
  bowerDirectory: 'bower_components',
  nodeModulesPath: 'node_modules',

  bowerDependencies() {
    return {
      "paper-elements": "x.x.x",
      "iron-icons": "x.x.x",
      "some-non-existant": "x.x.x",
      "ember": "x.x.x"
    };
  },

  dependencies() {
    return {
      "ember-cli": "x.x.x"
    };
  }
};
