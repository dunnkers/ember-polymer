/* jshint node: true */
'use strict';
let path = require('path');
let fs = require('fs');
let readFile = fs.readFileSync;
let fileExists = fs.existsSync;

module.exports = class Package {
  constructor(dir, name, pkgFile) {
    this.dir = dir;
    this.name = name;
    this.pkgFile = pkgFile;
  }

  get path() {
    return path.join(this.dir, this.name);
  }

  get link() {
    let allImportsPath = path.join(this.path, 'all-imports.html');
    let elementPath = path.join(this.path, `${this.name}.html`);
    let linkPath = fileExists(allImportsPath) ? allImportsPath : elementPath;
    linkPath = path.join('..', '..', linkPath);

    return `<link rel="import" href="${linkPath}">`;
  }

  hasWebComponentsKeyword() {
    let pkgPath = path.join(this.dir, this.name, this.pkgFile);

    if (fileExists(pkgPath)) {
      let json = JSON.parse(readFile(pkgPath));
      return json && json.keywords && json.keywords.includes('web-components');
    } else {
      return false;
    }
  }

  isWebComponent() {
    let elementPath = path.join(this.dir, this.name, `${this.name}.html`);
    return fileExists(elementPath) && this.hasWebComponentsKeyword();
  }
};
