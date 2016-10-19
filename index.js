/* jshint node: true */
'use strict';
let fs = require('fs');
let fileExists = fs.existsSync;
let path = require('path');
let MergeTrees = require('broccoli-merge-trees');
let Vulcanize = require('broccoli-vulcanize');
let AutoElementImporter = require('./lib/auto-element-importer');
let clone = require('clone');
let assign = require('assign-deep');

const defaultOptions = {
  autoElementImport: true,
  excludeElements: [],
  htmlImportsFile: path.join('app', 'elements.html'),
  vulcanizeOutput: path.join('assets', 'vulcanized.html'),
  vulcanizeOptions: {
    inlineCss: true,
    inlineScripts: true
  }
};

module.exports = {
  name: 'ember-polymer',

  init: function() {
    if (this._super.init) {
      this._super.init.apply(this, arguments);
    }

    // clone default config
    this.options = clone(defaultOptions);
  },

  included: function(appOrAddon) {
    this._super.included.apply(this, arguments);

    // retrieve addon options
    let app = appOrAddon.app || appOrAddon;
    let addonOptions = app.options[this.project.name()] || {};

    // assign addon options to config
    this.options = assign(this.options, addonOptions);
    this.options.projectTree = app.trees.app;
    // convert htmlImportsFile path to an absolute one
    this.options.htmlImportsFile = path.join(app.project.root,
      this.options.htmlImportsFile);

    // auto-import elements
    let autoImporter = new AutoElementImporter(this.project, this.options);
    autoImporter.autoImport();

    // import webcomponentsjs polyfill library
    app.import(`${app.bowerDirectory}/webcomponentsjs/webcomponents.min.js`);
  },

  // insert polymer and vulcanized elements
  contentFor: function(type) {
    if (type === 'head') {
      return `<script>
                window.Polymer = window.Polymer || {};
                window.Polymer.dom = "shadow";
              </script>
              <link rel="import" href="/${this.options.vulcanizeOutput}">`;
    }
  },

  postprocessTree: function(type, tree) {
    if (type !== 'all') {
      return tree;
    }

    // specified vulcanize output file must be of html extension
    if (path.extname(this.options.vulcanizeOutput) !== '.html') {
      throw new Error('[ember-polymer] The `vulcanizeOutput` file ' +
        `is not a .html file. You specified '${this.options.vulcanizeOutput}'`);
    }

    // a html imports file must exist
    if (!fileExists(this.options.htmlImportsFile)) {
      this.ui.writeWarnLine('[ember-polymer] No html imports file ' +
        `exists at '${this.htmlImportsFile}'`);
      return tree;
    }

    // vulcanize html files, starting at specified html imports file
    let options = Object.assign(this.options.vulcanizeOptions, {
      input: path.basename(this.options.htmlImportsFile),
      output: this.options.vulcanizeOutput
    });

    // merge normal tree and our vulcanize tree
    let vulcanize = new Vulcanize(this.options.projectTree, options);
    return new MergeTrees([ tree, vulcanize ], {
      overwrite: true,
      annotation: 'Merge (ember-polymer merge vulcanize with addon tree)'
    });
  }
};
