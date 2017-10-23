/* eslint-env node */
'use strict';
const Plugin = require('broccoli-plugin');
const path = require('path');
const fs = require('fs-extra');

module.exports = class ElementWriter extends Plugin {
  constructor(inputNode, options, importer) {
    super([ inputNode ]);
    this.options = options;
    this.importer = importer;
  }

  build() {
    // auto-import elements
    if (this.options.autoElementImport) {
      // import elements
      let imported = this.importer.importElements();
      let outputPath = path.join(this.outputPath,
                                 path.basename(this.options.htmlImportsFile));

      return fs.outputFile(outputPath, imported);
    } else {
      // manual-import elements
      return this.options.htmlImportsDir;
    }
  }
};
