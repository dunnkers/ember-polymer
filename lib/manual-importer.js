/* jshint node: true */
'use strict';
let fs = require('fs');
let readFile = fs.readFileSync;
let fileExists = fs.existsSync;
let path = require('path');

module.exports = class ManualImporter {
  constructor(options, ui, packages) {
    this.options = options;
    this.ui = ui;
    this.packages = packages;
  }

  isAlreadyImported(importPath) {
    return this.packages.some((pkg) => {
      return importPath.includes(`${pkg.name}/${pkg.name}.html`);
    });
  }

  fixManualImport(match, pre, q1, importPath, q2, post) {
    let importDir = this.options.htmlImportsDir;
    let normalized = path.normalize(path.join(importDir, importPath));
    let relativeToRoot = path.relative(this.options.projectRoot, normalized);
    let fixedPath = path.join('..', '..', relativeToRoot);

    if (!fileExists(normalized)) {
      this.ui.writeWarnLine('Invalid html import path, file not found ' +
                            `\`${importPath}\` (ember-polymer)`);
      return '';
    }

    return this.isAlreadyImported(fixedPath) ? '' : `${pre}${fixedPath}${post}`;
  }

  getImports() {
    let imports = readFile(this.options.htmlImportsFile, 'utf8');

    // fix import paths to match the tmpImportsDir relative
    const regex = /(<.*href=(\"|\'))(.*)((\"|\').*>)/g;
    imports = imports.replace(regex, this.fixManualImport.bind(this));

    // advise user to remove file if everything was already auto-imported
    if (!imports.trim()) {
      this.ui.writeInfoLine('All your html imports ' +
          'were already auto-imported. You can delete ' +
          `\`${this.options.relativeHtmlImportsFile}\` (ember-polymer)`);
    }

    return imports;
  }
};
