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

    // set root dir
    this.projectTree = app.trees.app;
    // convert relative path to absolute path
    this.htmlImportsFile = path.join(app.project.root, this.htmlImportsFile);
  }

  get relativeHtmlImportsFile() {
    return path.relative(this.project.root, this.htmlImportsFile);
  }
};
