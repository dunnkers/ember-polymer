/* jshint node: true */
'use strict';
var fs = require('fs');
var path = require('path');
var MergeTrees = require('broccoli-merge-trees');
var Vulcanize = require('broccoli-vulcanize');

module.exports = {
  name: 'ember-polymer',

  included: function(app) {
    this._super.included.apply(this, arguments);

    this.addonOptions = this.app.options['ember-polymer'] || {};
    this.htmlImportsFile = this.addonOptions.htmlImportsFile ||
      path.join('app', 'elements.html');
    this.vulcanizedOutput = this.addonOptions.vulcanizedOutput ||
      path.join('assets', 'vulcanized.html');
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
              <link rel="import" href="${this.vulcanizedOutput}">`;
    }
  },

  postprocessTree: function(type, tree) {
    if (type === 'all') {
      // vulcanize elements, starting at specified html imports file
      if (path.extname(this.vulcanizedOutput) !== '.html') {
        throw new Error('[ember-polymer] The `vulcanizedOutput` file ' +
          `is not a .html file. You specified '${this.vulcanizedOutput}'`);
      }

      var filePath = path.join(this.app.project.root,
                               this.htmlImportsFile);
      if (fs.existsSync(filePath)) {
        var vulcanized = new Vulcanize(this.projectTree, {
          input: path.basename(this.htmlImportsFile),
          output: this.vulcanizedOutput,
          inlineCss: true
        });

        return new MergeTrees([ tree, vulcanized ], {
          overwrite: true,
          annotation: 'Merge (ember-polymer merge vulcanized with addon tree)'
        });
      } else {
        this.ui.writeWarnLine('[ember-polymer] No `htmlImports` file ' +
          `exists at '${this.htmlImportsFile}'`);
      }
    }

    return tree;
  }
};
