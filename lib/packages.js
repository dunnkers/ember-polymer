/* eslint-env node */
'use strict';
let path = require('path');
let fs = require('fs');
let readFile = fs.readFileSync;
let fileExists = fs.existsSync;

let Package = require('./package');

module.exports = class Packages {
  constructor(project, options) {
    this.project = project;
    this.options = options || {};
  }

  isWebComponent(pkg) {
    if (!fileExists(pkg.elementPath) || !fileExists(pkg.packagePath)) {
      return false;
    }

    let json = JSON.parse(readFile(pkg.packagePath));
    return !!json && !!json.keywords &&
              json.keywords.indexOf('web-components') !== -1;
  }

  getWebComponentPackages(dependencies, dir, pkgFile) {
    return Object.keys(dependencies)
              .map((name) => new Package(dir, name, pkgFile))
              .filter(this.isWebComponent);
  }

  getPackages() {
    let bowerPackages = this.getWebComponentPackages(
              this.project.bowerDependencies(),
              this.project.bowerDirectory, 'bower.json');
    let npmPackages = this.getWebComponentPackages(
              this.project.dependencies(),
              path.basename(this.project.nodeModulesPath), 'package.json');

    return bowerPackages.concat(npmPackages).filter((pkg) =>
      this.options.excludeElements ? 
        this.options.excludeElements.indexOf(pkg.name) === -1 : true
    );
  }
};
