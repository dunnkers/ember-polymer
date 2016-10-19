/* jshint node: true */
'use strict';
let fs = require('fs');
let fileExists = fs.existsSync;
let path = require('path');
let MergeTrees = require('broccoli-merge-trees');
let Vulcanize = require('broccoli-vulcanize');
let AutoElementImporter = require('./lib/auto-element-importer');

const defaultVulcanizeOptions = {
  inlineCss: true,
  inlineScripts: true
};

module.exports = {
  name: 'ember-polymer',

  init: function() {
    if (this._super.init) {
      this._super.init.apply(this, arguments);
    }

    this.autoElementImporter = new AutoElementImporter(this.project);
    this.autoElementImporter.computePackages(this);
  },

  included: function(appOrAddon) {
    this._super.included.apply(this, arguments);

    let app = appOrAddon.app || appOrAddon;
    let addonOptions = app.options['ember-polymer'] || {};

    this.htmlImportsFile = addonOptions.htmlImportsFile ||
      path.join('app', 'elements.html');
    this.vulcanizeOutput = addonOptions.vulcanizeOutput ||
      path.join('assets', 'vulcanized.html');
    this.vulcanizeOptions = Object.assign(defaultVulcanizeOptions,
      addonOptions.vulcanizeOptions);
    this.projectTree = app.trees.app;
    this.autoElementImport = addonOptions.autoElementImport || true;
    this.excludeElements = addonOptions.excludeElements || [];

    if (this.autoElementImport) {
      let dir = this.autoElementImporter.writeImportsToFile(
        this.excludeElements);
      this.projectTree = dir;
      this.htmlImportsFile = path.join(dir, 'html-imports.html');
    }

    app.import(app.bowerDirectory + '/webcomponentsjs/webcomponents.min.js');
  },

  // insert polymer and vulcanized elements
  contentFor: function(type) {
    if (type === 'head') {
      return `<script>
                window.Polymer = window.Polymer || {};
                window.Polymer.dom = "shadow";
              </script>
              <link rel="import" href="/${this.vulcanizeOutput}">`;
    }
  },

  postprocessTree: function(type, tree) {
    if (type === 'all') {
      if (path.extname(this.vulcanizeOutput) !== '.html') {
        throw new Error('[ember-polymer] The `vulcanizeOutput` file ' +
          `is not a .html file. You specified '${this.vulcanizeOutput}'`);
      }

      let filePath = path.join(this.app.project.root,
                               this.htmlImportsFile);

      if (this.autoElementImport || fileExists(filePath)) {
        // vulcanize html files, starting at specified html imports file
        let options = Object.assign(this.vulcanizeOptions, {
          input: path.basename(this.htmlImportsFile),
          output: this.vulcanizeOutput
        });

        let vulcanized = new Vulcanize(this.projectTree, options);

        return new MergeTrees([ tree, vulcanized ], {
          overwrite: true,
          annotation: 'Merge (ember-polymer merge vulcanized with addon tree)'
        });
      } else {
        this.ui.writeWarnLine('[ember-polymer] No html imports file ' +
          `exists at '${this.htmlImportsFile}'`);
      }
    }

    return tree;
  }
};
