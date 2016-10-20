/* jshint node: true */
'use strict';
let fs = require('fs');
let fileExists = fs.existsSync;
let path = require('path');
let MergeTrees = require('broccoli-merge-trees');
let Vulcanize = require('broccoli-vulcanize');
let AutoImporter = require('./lib/auto-importer');
let Config = require('./lib/config');

module.exports = {
  name: 'ember-polymer',

  included: function(appOrAddon) {
    this._super.included.apply(this, arguments);

    // config
    let app = appOrAddon.app || appOrAddon;
    this.options = new Config(this.project, app);

    // auto-import elements
    let autoImporter = new AutoImporter(this.project, this.options, this.ui);
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
      this.ui.writeWarnLine('No html imports file exists at ' +
        `\`${this.options.relativeHtmlImportsFile}\` (ember-polymer)`);
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
