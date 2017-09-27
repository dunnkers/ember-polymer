/* eslint-env node */
'use strict';
let fs = require('fs');
let fileExists = fs.existsSync;
let writeFile = fs.writeFileSync;
let MergeTrees = require('broccoli-merge-trees');
let Vulcanize = require('broccoli-vulcanize');
let quickTemp = require('quick-temp');
let Importer = require('./lib/importer');
let Config = require('./lib/config');
let Bundler = require('./bundler');

module.exports = {
  name: 'ember-polymer',

  included(appOrAddon) {
    this._super.included.apply(this, arguments);

    // config
    let app = appOrAddon.app || appOrAddon;
    this.options = new Config(app);

    // auto-import elements
    if (this.options.autoElementImport) {
      // import elements
      let importer = new Importer(this.project, this.options, this.ui);
      let imported = importer.importElements();

      // create a temporary directory to store html imports in.
      quickTemp.makeOrRemake(this, 'tmpImportsDir', this.name);
      this.options.htmlImportsDir = this.tmpImportsDir;
      writeFile(this.options.htmlImportsFile, imported);
    }

    // import webcomponentsjs polyfill library
    app.import(`${app.bowerDirectory}/webcomponentsjs/webcomponents-lite.js`);
  },

  // insert polymer and vulcanized elements
  contentFor(type, config) {
    if (type === 'head') {
      let href = config.rootURL + this.options.vulcanizeOutput;

      return `<script>
                window.Polymer = window.Polymer || {};
                window.Polymer.dom = "shadow";
              </script>
              <link rel="import" href="${href}">`;
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

    let bundler = new Bundler(this.options.htmlImportsDir,
                              this.options.vulcanizeOptions);

    // merge normal tree and our vulcanize tree
    // let vulcanize = new Vulcanize(this.options.htmlImportsDir,
    //                               this.options.vulcanizeOptions);
    return new MergeTrees([ tree, bundler ], {
      overwrite: true,
      annotation: 'Merge (ember-polymer merge vulcanize with addon tree)'
    });
  }
};
