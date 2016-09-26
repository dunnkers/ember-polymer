/* jshint node: true */
'use strict';
let fs = require('fs');
let path = require('path');
let MergeTrees = require('broccoli-merge-trees');
let Vulcanize = require('broccoli-vulcanize');

const defaultVulcanizeOptions = {
  inlineCss: true,
  inlineScripts: true
};

module.exports = {
  name: 'ember-polymer',

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

    app.import(app.bowerDirectory + '/webcomponentsjs/webcomponents.min.js');
  },

  // insert polymer and vulcanized elements
  contentFor: function(type) {
    if (type === 'head') {
      return `<script>
                window.Polymer = window.Polymer || {};
                window.Polymer.dom = "shadow";
              </script>
              <link rel="import" href="${this.vulcanizeOutput}">`;
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
      if (fs.existsSync(filePath)) {
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
