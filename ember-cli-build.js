/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const path = require('path');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    'ember-polymer': {
      htmlImportsFile: path.join('tests', 'dummy', 'app', 'elements.html'),
      vulcanizeOptions: {
        stripExcludes: ['.*paper-styles\.html.*']
      }
    }
  });

  return app.toTree();
};
