/* eslint-env node */
'use strict';
const Plugin = require('broccoli-plugin');
const path = require('path');
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

    this.options = {
      root: '' // use cwd by default
    };
    Object.assign(this.options, options);

    if (!this.options.input) {
      throw new Error(`[ember-polymer-bundler] No input path found! 😵`);
    }

    this.options.analyzer = this.options.analyzer || new Analyzer({
      urlLoader: new FSUrlLoader(this.options.root)
    });
    this.options.output = this.options.output || this.options.input;
  }

  build() {
    let bundler = new Bundler(this.options);
    let input = path.join(this.inputPaths[0], this.options.input);
    input = path.relative(this.options.root, input);
    let output = path.join(this.outputPath, this.options.output);

    // generateManifest takes urls relative to options.root
    return bundler.generateManifest([ input ])
    .then((manifest) => {
      return bundler.bundle(manifest);
    }).then((result) => {
      let html = parse5.serialize(result.documents.get(input).ast);

      return fs.outputFile(output, html);
    }).catch(err => {
      throw new Error(`ember-polymer bundler.bundle() failure: ${err}`);
    });
  }
};
