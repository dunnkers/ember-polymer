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
  constructor(inputNode, options) {
    super([ inputNode ], {
      name: 'Element Bundler',
      annotation: 'Bundles Polymer elements using polymer-bundler'
    });

    this.options = options;
  }

  bundle(options) {
    let urlLoader = new FSUrlLoader(this.options.projectRoot);
    let analyzer = new Analyzer({ urlLoader });
    options.analyzer = analyzer;
    let bundler = new Bundler(options);

    // generateManifest takes urls relative to project root
    return bundler.generateManifest([ options.input ])
    .then((manifest) => {
      return bundler.bundle(manifest);
    }).then((result) => {
      let html = parse5.serialize(result.documents.get(options.input).ast);

      return fs.outputFile(options.output, html);
    }).catch(err => {
      throw new Error(`ember-polymer bundler.bundle() failure: ${err}`);
    });
  }

  build() {
    let options = clone(this.options.vulcanizeOptions); // Clone to prevent object syncing
    let outputFilepath = options.output || path.basename(options.input);
    options.output = path.join(this.outputPath, outputFilepath);
    options.input = path.join(this.inputPaths[0], options.input);
    options.input = path.relative(this.options.projectRoot, options.input);

    return this.bundle(options);
  }
};
