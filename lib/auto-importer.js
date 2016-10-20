/* jshint node: true */
'use strict';
let fs = require('fs');
let readFile = fs.readFileSync;
let writeFile = fs.writeFileSync;
let fileExists = fs.existsSync;
let path = require('path');
let quickTemp = require('quick-temp');
let Package = require('./package');

module.exports = class AutoImporter {
  constructor(project, options, ui) {
    this.project = project;
    this.options = options;
    this.ui = ui;
  }

  getWebComponentPackages(dependencies, dir, pkgFile) {
    return Object.keys(dependencies).map((name) => {
      let pkg = new Package(dir, name, pkgFile);

      return pkg.isWebComponent() ? pkg : false;
    }).filter((pkg) => !!pkg);
  }

  getBowerPackages() {
    return this.getWebComponentPackages(this.project.bowerDependencies(),
      this.project.bowerDirectory, 'bower.json');
  }

  getNpmPackages() {
    return this.getWebComponentPackages(this.project.dependencies(),
      path.basename(this.project.nodeModulesPath), 'package.json');
  }

  getPackages() {
    return this.bowerPackages().concat(this.npmPackages()).filter((pkg) =>
      !this.options.excludeElements.includes(pkg.name));
  }

  isAlreadyImported(importPath) {
    return this.packages.some((pkg) => {
      return importPath.includes(`${pkg.name}/${pkg.name}.html`);
    });
  }

  fixManualImport(match, pre, q1, importPath, q2, post) {
    let importDir = path.dirname(this.options.htmlImportsFile);
    let normalized = path.normalize(path.join(importDir, importPath));
    let relativeToRoot = path.relative(this.project.root, normalized);
    let fixedPath = path.join('..', '..', relativeToRoot);

    if (!fileExists(normalized)) {
      this.ui.writeWarnLine('Invalid html import path, file not found ' +
                            `\`${importPath}\` (ember-polymer)`);
      return '';
    }

    return this.isAlreadyImported(fixedPath) ? '' : `${pre}${fixedPath}${post}`;
  }

  getFixedManualImports() {
    if (!fileExists(this.options.htmlImportsFile)) {
      return;
    }
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

  autoImport() {
    if (!this.options.autoElementImport) {
      return;
    }

    // create a temporary directory to store html imports in.
    quickTemp.makeOrRemake(this, 'tmpImportsDir');

    // construct html imports file data
    this.packages = this.getPackages();
    let data = this.packages.map((pkg) => pkg.link).join('\n');
    // load data from htmlImportsFile
    let manualImports = this.getFixedManualImports();
    data.concat('\n', manualImports);

    // modify options to fit new imports file and root dir
    let filename = path.basename(this.options.htmlImportsFile);
    let filepath = path.join(this.tmpImportsDir, filename);
    this.options.htmlImportsFile = filepath;
    this.options.projectTree = this.tmpImportsDir;

    // write element imports to temporary file
    writeFile(this.options.htmlImportsFile, data);
  }
};
