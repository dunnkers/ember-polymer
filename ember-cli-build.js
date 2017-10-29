/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const path = require('path');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    'ember-polymer': {
      htmlImportsFile: path.join('tests', 'dummy', 'app', 'elements.html')
    }
  });

  return app.toTree();
};
