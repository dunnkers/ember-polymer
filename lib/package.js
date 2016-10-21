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

  get elementPath() {
    return path.join(this.dir, this.name, `${this.name}.html`);
  }

  get packagePath() {
    return path.join(this.dir, this.name, this.pkgFile);
  }

  get allImports() {
    return path.join(this.dir, this.name, 'all-imports.html');
  }

  get link() {
    let linkPath = fileExists(this.allImports) ?
                    this.allImports : this.elementPath;
    linkPath = path.join('..', '..', linkPath);

    return `<link rel="import" href="${linkPath}">`;
  }

  hasWebComponentsKeyword() {
    if (fileExists(this.packagePath)) {
      let json = JSON.parse(readFile(this.packagePath));
      return json && json.keywords && json.keywords.includes('web-components');
    } else {
      return false;
    }
  }

  isWebComponent() {
    return fileExists(this.elementPath) && this.hasWebComponentsKeyword();
  }
};
