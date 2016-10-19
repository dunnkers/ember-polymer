/* jshint node: true */
'use strict';
let fs = require('fs');
let path = require('path');
let writeFile = fs.writeFileSync;
let quickTemp = require('quick-temp');
let Package = require('./package');

module.exports = class AutoElementImporter {
  constructor(project) {
    this.project = project;
  }

  getPackages(dependencies, dir, pkgFile) {
    return Object.keys(dependencies).map((name) => {
      let pkg = new Package(dir, name, pkgFile);

      return pkg.isWebComponent() ? pkg : false;
    }).filter((pkg) => !!pkg);
  }

  computePackages() {
    let bowerPackages = this.getPackages(this.project.bowerDependencies(),
      this.project.bowerDirectory, 'bower.json');
    let npmPackages = this.getPackages(this.project.dependencies(),
      path.basename(this.project.nodeModulesPath), 'package.json');

    this.elementsToImport = bowerPackages.concat(npmPackages);
  }

  writeImportsToFile(excludeElements) {
    this.elementsToImport = this.elementsToImport.filter(
      (pkg) => !excludeElements.includes(pkg.name));
    this.elementsToImport = this.elementsToImport.map((pkg) => pkg.link);

    // create a temporary directory to store html imports in.
    quickTemp.makeOrRemake(this, 'tmpImportsDir');

    // write element imports to temporary file
    writeFile(path.join(this.tmpImportsDir, 'html-imports.html'),
              this.elementsToImport.join('\n'));

    return this.tmpImportsDir;
  }
};
