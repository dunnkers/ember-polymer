/* jshint node: true */
'use strict';
let fs = require('fs');
let writeFile = fs.writeFileSync;
let path = require('path');
let quickTemp = require('quick-temp');
let Package = require('./package');

module.exports = class AutoElementImporter {
  constructor(project, options) {
    this.project = project;
    this.options = options;
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
      !this.options.excludeElements.includes(pkg.name)
    );
  }

  autoImport() {
    if (!this.options.autoElementImport) {
      return;
    }

    // create a temporary directory to store html imports in.
    quickTemp.makeOrRemake(this, 'tmpImportsDir');

    // modify options to fit new imports file and root dir
    let filename = path.basename(this.options.htmlImportsFile);
    let filepath = path.join(this.tmpImportsDir, filename);
    this.options.htmlImportsFile = filepath;
    this.options.projectTree = this.tmpImportsDir;

    // write element imports to temporary file
    let data = this.packages.map((pkg) => pkg.link).join('\n');
    writeFile(this.options.htmlImportsFile, data);
  }
};
