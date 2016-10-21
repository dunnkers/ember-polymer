/* jshint node: true */
'use strict';
let fs = require('fs');
let fileExists = fs.existsSync;
let path = require('path');
let Package = require('./package');
let ManualImporter = require('./manual-importer');

module.exports = class AutoImporter {
  constructor(project, options, ui) {
    this.project = project;
    this.options = options;
    this.ui = ui;
  }

  getWebComponentPackages(dependencies, dir, pkgFile) {
    return Object.keys(dependencies)
              .map((name) => new Package(dir, name, pkgFile))
              .filter((pkg) => pkg.isWebComponent());
  }

  getPackages() {
    let bowerPackages = this.getWebComponentPackages(
              this.project.bowerDependencies(),
              this.project.bowerDirectory, 'bower.json');
    let npmPackages = this.getWebComponentPackages(
              this.project.dependencies(),
              path.basename(this.project.nodeModulesPath), 'package.json');

    return bowerPackages.concat(npmPackages).filter((pkg) =>
      !this.options.excludeElements.includes(pkg.name)
    );
  }

  importElements() {
    this.packages = this.getPackages();

    // all auto-created link import statements
    let autoImports = this.packages.map((pkg) => pkg.link).join('\n');

    // all imports done by user
    if (fileExists(this.options.htmlImportsFile)) {
      let manualImporter = new ManualImporter(this.project, this.options,
                                              this.ui, this.packages);
      let manualImports = manualImporter.getImports();
      autoImports = autoImports.concat('\n', manualImports);
    }

    return autoImports;
  }
};
