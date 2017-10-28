/* eslint-env node */
'use strict';
let path = require('path');
let MergeTrees = require('broccoli-merge-trees');
let fileWriter = require('broccoli-file-creator');
let Config = require('./lib/config');
let Importer = require('./lib/importer');
let ElementBundler = require('./lib/bundler');

module.exports = {
  name: 'ember-polymer',

  included(appOrAddon) {
    this._super.included.apply(this, arguments);

    // config
    let app = appOrAddon.app || appOrAddon;
    this.options = new Config(app);

    // import webcomponentsjs polyfill library
    app.import(`${app.bowerDirectory}/webcomponentsjs/webcomponents-lite.js`);
  },

  // insert polymer and vulcanized elements
  contentFor(type, config) {
    if (type === 'head') {
      let href = config.rootURL + this.options.vulcanizeOutput;

      return `<link rel="import" href="${href}">`;
    }
  },

  postprocessTree(type, tree) {
    if (type !== 'all') {
      return tree;
    }

    // import elements
    let importer = new Importer(this.project, this.options, this.ui);
    let contents = importer.importElements();
    let filepath = path.basename(this.options.htmlImportsFile);
    let entryNode = fileWriter(filepath, contents);

    // merge normal tree and our bundler tree
    let bundler = new ElementBundler(entryNode, this.options.vulcanizeOptions);

    return new MergeTrees([ tree, bundler ], {
      overwrite: true,
      annotation: 'Merge (ember-polymer merge bundler with addon tree)'
    });
  }
};
