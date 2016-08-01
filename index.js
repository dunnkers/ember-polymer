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
    this.htmlImportsDir = this.addonOptions.htmlImportsDir || 'app';
    this.htmlImportsFile = this.addonOptions.htmlImportsFile || 'elements.html';
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

  // vulcanize elements, starting at specified html imports file
  postprocessTree: function(type, tree) {
    if (type === 'all') {
      if (!this.vulcanizedOutput.endsWith('.html')) { // wrong extension
        throw new Error('ember-polymer vulcanize output file not a html file.');
      }

      var filePath = path.join(this.app.project.root,
                               this.htmlImportsDir,
                               this.htmlImportsFile);
      if (fs.existsSync(filePath)) {
        var vulcanized = new Vulcanize(this.projectTree, {
          input: this.htmlImportsFile,
          output: this.vulcanizedOutput,
          inlineCss: true
        });

        return new MergeTrees([ tree, vulcanized ], {
          overwrite: true,
          annotation: 'Merge (ember-polymer merge vulcanized with addon tree)'
        });
      } else {
        console.warn(`[ember-polymer] The htmlImportsDir or htmlImportsFile
          you specified does not exist or is invalid. Make sure you configured
          your html imports file correctly in the addon settings, the default
          file is app/elements.html.

          If you no longer use ember-polymer and wish to get rid of this
          message, consider removing this addon.`);
      }
    }

    return tree;
  }
};
