/* eslint-env node */
'use strict';
let path = require('path');

module.exports = class Config {
  constructor(app) {
    // defaults
    this.autoElementImport = true;
    this.excludeElements = [];
    this.htmlImportsFile = path.join('app', 'elements.html');
    this.vulcanizeOutput = path.join('assets', 'vulcanized.html');
    this.vulcanizeOptions = {
      stripComments: true
    };

    // retrieve and apply addon options
    let addonOptions = app.options['ember-polymer'] || {};
    Object.assign(this, addonOptions);
    this.projectRoot = app.project.root;

    // convert relative path to absolute path
    this.htmlImportsFile = path.join(this.projectRoot, this.htmlImportsFile);
  }

  set htmlImportsDir(htmlImportsDir) {
    this.htmlImportsFile = path.join(htmlImportsDir,
      path.basename(this.htmlImportsFile));
  }

  get htmlImportsDir() {
    return path.dirname(this.htmlImportsFile);
  }

  get relativeHtmlImportsFile() {
    return path.relative(this.projectRoot, this.htmlImportsFile);
  }

  set vulcanizeOutput(vulcanizeOutput) {
    if (path.extname(vulcanizeOutput) === '.html') {
      this._vulcanizeOutput = vulcanizeOutput;
    } else {
      throw new Error('[ember-polymer] The `vulcanizeOutput` file ' +
      `is not a .html file. You specified '${vulcanizeOutput}'`);
    }
  }

  get vulcanizeOutput() {
    return this._vulcanizeOutput;
  }

  set vulcanizeOptions(vulcanizeOptions) {
    this._vulcanizeOptions = vulcanizeOptions;
  }

  get vulcanizeOptions() {
    return Object.assign(this._vulcanizeOptions, {
      input: path.basename(this.htmlImportsFile),
      output: this.vulcanizeOutput
    });
  }
};
