/* jshint node: true */
'use strict';
let fs = require('fs');
let readFile = fs.readFileSync;
let writeFile = fs.writeFileSync;
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

  get bowerPackages() {
    return this.getWebComponentPackages(this.project.bowerDependencies(),
      this.project.bowerDirectory, 'bower.json');
  }

  get npmPackages() {
    return this.getWebComponentPackages(this.project.dependencies(),
      path.basename(this.project.nodeModulesPath), 'package.json');
  }

  get packages() {
    return this.bowerPackages.concat(this.npmPackages).filter((pkg) =>
      !this.options.excludeElements.includes(pkg.name));
  }

  fixManualPath(match, importPath) {
    let importDir = path.dirname(this.options.htmlImportsFile);
    let normalized = path.normalize(path.join(importDir, importPath));
    let relativeToRoot = path.relative(this.project.root, normalized);
    let fixedPath = path.join('..', '..', relativeToRoot);

    return `href=${fixedPath}`;
  }

  removeAlreadyImported(imports) {
    for (let pkg of this.packages) {
      imports.replace(`\<.*${pkg.name}\\${path.sep}${pkg.name}.html.*\<`);
    }
  }

  importsMerger() {
    let imports = readFile(this.options.htmlImportsFile, 'utf8');

    // fix import paths to match the tmpImportsDir relative
    const regex = /href\=\"(.*)\"/g;
    imports.replace(regex, this.fixManualPath.bind(this));

    // remove already automatically imported packages
    this.removeAlreadyImported(imports);

    // advise user to remove file if everything was already auto imported
    if (!!imports.trim()) {
      this.ui.writeWarnLine('[ember-polymer] All your html imports ' +
        `were already auto-imported. You can delete ` +
        `${this.options.htmlImportsFile}`);
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
    let data = this.packages.map((pkg) => pkg.link).join('\n');
    // load data from htmlImportsFile
    let manualImports = this.importsMerger();
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
