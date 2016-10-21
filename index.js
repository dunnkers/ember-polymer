/* jshint node: true */
'use strict';
let fs = require('fs');
let path = require('path');
let fileExists = fs.existsSync;
let writeFile = fs.writeFileSync;
let MergeTrees = require('broccoli-merge-trees');
let Vulcanize = require('broccoli-vulcanize');
let quickTemp = require('quick-temp');
let AutoImporter = require('./lib/auto-importer');
let Config = require('./lib/config');

module.exports = {
  name: 'ember-polymer',

  included(appOrAddon) {
    this._super.included.apply(this, arguments);

    // config
    let app = appOrAddon.app || appOrAddon;
    this.options = new Config(this.project, app);

    // auto-import elements
    if (this.options.autoElementImport) {
      // create a temporary directory to store html imports in.
      quickTemp.makeOrRemake(this, 'tmpImportsDir', this.name);

      // import elements
      let importer = new AutoImporter(this.project, this.options, this.ui);
      let autoImported = importer.importElements();
      // write to temporary file
      this.options.htmlImportsFile = path.join(this.tmpImportsDir,
        path.basename(this.options.htmlImportsFile));
      writeFile(this.options.htmlImportsFile, autoImported);
    }

    // import webcomponentsjs polyfill library
    app.import(`${app.bowerDirectory}/webcomponentsjs/webcomponents.min.js`);
  },

  // insert polymer and vulcanized elements
  contentFor(type) {
    if (type === 'head') {
      return `<script>
                window.Polymer = window.Polymer || {};
                window.Polymer.dom = "shadow";
              </script>
              <link rel="import" href="/${this.options.vulcanizeOutput}">`;
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

    // merge normal tree and our vulcanize tree
    let vulcanize = new Vulcanize(path.dirname(this.options.htmlImportsFile),
                                  this.options.vulcanizeOptions);
    return new MergeTrees([ tree, vulcanize ], {
      overwrite: true,
      annotation: 'Merge (ember-polymer merge vulcanize with addon tree)'
    });
  },

  postBuild() {
    if (this.options.autoElementImport) {
      quickTemp.remove(this, 'tmpImportsDir');
    }
  }
};
