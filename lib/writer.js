/* eslint-env node */
'use strict';
const Plugin = require('broccoli-plugin');
const path = require('path');
const fs = require('fs-extra');

module.exports = class ElementWriter extends Plugin {
  constructor(elementPaths, filename) {
    super([]);
    this.elementPaths = elementPaths;
    this.filename = filename;
  }

  build() {
    let imports = this.elementPaths.map((elementPath) => {
      let href = path.relative(this.outputPath, elementPath);
      return `<link rel="import" href="${href}">`;
    }).join('\n');

    return fs.outputFile(path.join(this.outputPath, this.filename), imports);
  }
};
