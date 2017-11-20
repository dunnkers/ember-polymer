/* eslint-env node */
'use strict';

module.exports = {
  bowerDirectory: 'test/fixtures/bower_components_fixture',
  nodeModulesPath: 'test/fixtures/node_modules',

  bowerDependencies() {
    return {
      "iron-icons": "x.x.x",
      "moment": "x.x.x",
      "paper-button": "x.x.x",
      "paper-elements": "x.x.x",
      "js-seo": "x.x.x"
    };
  },

  dependencies() {
    return {
      "ember-cli": "x.x.x"
    };
  }
};
