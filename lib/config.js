/* jshint node: true */
'use strict';
let path = require('path');
let assign = require('assign-deep');

module.exports = class AutoImporter {
  constructor(project, app) {
    this.project = project;

    // defaults
    this.autoElementImport = true;
    this.excludeElements = [];
    this.htmlImportsFile = path.join('app', 'elements.html');
    this.vulcanizeOutput = path.join('assets', 'vulcanized.html');
    this.vulcanizeOptions = {
      inlineCss: true,
      inlineScripts: true
    };

    // retrieve and apply addon options
    let addonOptions = app.options[this.project.name()] || {};
    assign(this, addonOptions);

    // convert relative path to absolute path
    this.htmlImportsFile = path.join(app.project.root, this.htmlImportsFile);
  }

  set htmlImportsDir(htmlImportsDir) {
    this.htmlImportsFile = path.join(htmlImportsDir,
      path.basename(this.htmlImportsFile));
  }

  get htmlImportsDir() {
    return path.dirname(this.htmlImportsFile);
  }

  get relativeHtmlImportsFile() {
    return path.relative(this.project.root, this.htmlImportsFile);
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
