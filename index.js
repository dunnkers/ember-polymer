/* eslint-env node */
'use strict';
let fs = require('fs');
let fileExists = fs.existsSync;
let MergeTrees = require('broccoli-merge-trees');
let Config = require('./lib/config');
let Importer = require('./lib/importer');
let ElementWriter = require('./lib/writer');
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

    // a html imports file must exist
    if (!fileExists(this.options.htmlImportsFile)) {
      this.ui.writeWarnLine('No html imports file exists at ' +
        `\`${this.options.relativeHtmlImportsFile}\` (ember-polymer)`);
      return tree;
    }

    // merge normal tree and our bundler tree
    let importer = new Importer(this.project, this.options, this.ui);
    let writer = new ElementWriter(this.options.projectRoot, // could be anything
                                   this.options,
                                   importer);
    let bundler = new ElementBundler(writer, this.options);

    return new MergeTrees([ tree, bundler ], {
      overwrite: true,
      annotation: 'Merge (ember-polymer merge bundler with addon tree)'
    });
  }
};
