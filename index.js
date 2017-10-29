/* eslint-env node */
'use strict';
const path = require('path');
const MergeTrees = require('broccoli-merge-trees');
const Config = require('./lib/config');
const ElementBundler = require('./lib/bundler');
const DepWriter = require('./lib/dep-writer');
const depScraper = require('./lib/dep-scraper');
const depNormalizer = require('./lib/dep-normalizer');

module.exports = {
  name: 'ember-polymer',

  included(appOrAddon) {
    this._super.included.apply(this, arguments);

    // config
    let app = appOrAddon.app || appOrAddon;
    this.options = new Config(app, this.ui);

    // import webcomponentsjs polyfill library
    app.import(`${app.bowerDirectory}/webcomponentsjs/webcomponents-lite.js`);
  },

  // insert polymer and bundled elements
  contentFor(type, config) {
    if (type === 'head') {
      let href = path.join(config.rootURL, this.options.bundlerOutput);

      return `<link rel="import" href="${href}">`;
    }
  },

  postprocessTree(type, tree) {
    if (type !== 'all') {
      return tree;
    }

    // auto element import
    let bowerPath = path.join(this.options.projectRoot,
                                   this.project.bowerDirectory);
    let bowerPackages = depScraper(this.project.bowerDependencies(),
                                   bowerPath, 'bower.json');
    let npmPackages = depScraper(this.project.dependencies(),
                                 this.project.nodeModulesPath, 'package.json');
    let packages = bowerPackages.concat(npmPackages);
    packages = packages.map((pkg) => pkg.elementPath);

    // manual element import
    let manualPackages = depNormalizer(this.options.htmlImportsFile);

    // write and bundle
    let filepath = path.basename(this.options.htmlImportsFile);
    let writer = new DepWriter(packages.concat(manualPackages), filepath);
    let bundler = new ElementBundler(writer, this.options.bundlerOptions);

    // TODO: add warnings for unused manuals, add warnings for duplicate imports

    // merge normal tree and our bundler tree
    return new MergeTrees([ tree, bundler ], {
      overwrite: true,
      annotation: 'Merge (ember-polymer merge bundler with addon tree)'
    });
  }
};
