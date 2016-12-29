/* jshint node: true */
'use strict';
let fs = require('fs');
let fileExists = fs.existsSync;
let Packages = require('./packages');
let ManualImporter = require('./manual-importer');

module.exports = class AutoImporter {
  constructor(project, options, ui) {
    this.project = project;
    this.options = options;
    this.ui = ui;
  }

  importElements() {
    this.packages = new Packages(this.project);
    let packages = this.packages.getPackages();

    // all auto-created link import statements
    let autoImports = packages.map((pkg) => pkg.link).join('\n');

    // all imports done by user
    if (fileExists(this.options.htmlImportsFile)) {
      let importer = new ManualImporter(this.options, this.ui, packages);
      let manualImports = importer.getImports();
      autoImports = autoImports.concat('\n', manualImports);
    }

    return autoImports.trim();
  }
};
