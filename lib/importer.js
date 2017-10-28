/* eslint-env node */
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
    let imports = '';
    this.packages = new Packages(this.project);
    let packages = this.packages.getPackages();

    if (this.options.autoElementImport) {
      // all auto-created link import statements
      imports += packages.map((pkg) => pkg.link).join('\n');
    }

    // all imports done by user
    if (fileExists(this.options.htmlImportsFile)) {
      let importer = new ManualImporter(this.options, this.ui, packages);
      let manualImports = importer.getImports();
      imports += `\n${manualImports}`;
    } else if (!this.options.autoElementImport) {
      this.ui.writeWarnLine('No html imports file exists at ' +
        `\`${this.options.relativeHtmlImportsFile}\` 🤓 (ember-polymer)`);
    } else if (!imports.trim()) {
      this.ui.writeWarnLine('No elements were imported. Install some via ' +
        'bower or npm 😉 (ember-polymer)');
    }

    return imports.trim();
  }
};
