/* eslint-env node */
'use strict';
const Plugin = require('broccoli-plugin');
const path = require('path');
const fs = require('fs-extra');

module.exports = class DepWriter extends Plugin {
  constructor(elemPaths, filename) {
    super([]);
    this.elemPaths = elemPaths;
    this.filename = filename;
  }

  build() {
    let imports = this.elemPaths.map((elemPath) => {
      let href = path.relative(this.outputPath, elemPath);
      return `<link rel="import" href="${href}">`;
    }).join('\n');

    return fs.outputFile(path.join(this.outputPath, this.filename), imports);
  }
};
