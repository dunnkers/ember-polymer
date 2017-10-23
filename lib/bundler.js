/* eslint-env node */
'use strict';
const Plugin = require('broccoli-plugin');
const path = require('path');
const clone = require('clone');
const fs = require('fs-extra');
const { Bundler } = require('polymer-bundler');
const { Analyzer, FSUrlLoader } = require('polymer-analyzer');
const parse5 = require('parse5');

module.exports = class ElementBundler extends Plugin {
  constructor(inputNodes, projectRoot, options) {
    super([ inputNodes ]);

    this.projectRoot = projectRoot;
    this.options = clone(options) || {}; // Clone to prevent object syncing
    this.outputFilepath = options.output || path.basename(options.input);

    let urlLoader = new FSUrlLoader(path.resolve(projectRoot));
    let analyzer = new Analyzer({ urlLoader });
    this.bundler = new Bundler({ analyzer });
  }

  bundle(options) {
    return this.bundler.generateManifest([ options.input ])
    .then((manifest) => {
      return this.bundler.bundle(manifest);
    }).then((result) => {
      let html = parse5.serialize(result.documents.get(options.input).ast);

      return fs.outputFile(options.output, html);
    }).catch(err => {
      throw new Error(`ember-polymer bundler.bundle() failure: ${err}`);
    });
  }

  build() {
    let options = clone(this.options); // Clone to prevent object syncing
    options.output = path.join(this.outputPath, this.outputFilepath);
    options.input = path.join(this.inputPaths[0], options.input);
    options.input = path.relative(this.projectRoot, options.input);

    return this.bundle(options);
  }
};
