/* eslint-env node */
'use strict';
const path = require('path');
// broccoli plugins
const MergeTrees = require('broccoli-merge-trees');
const ElementBundler = require('./lib/bundler');
const ElementWriter = require('./lib/writer');
// internals
const Config = require('./lib/config');
const { scrapeDeps } = require('./lib/scraper');
const extractDeps = require('./lib/extractor');

module.exports = {
  name: 'ember-polymer',

  included(appOrAddon) {
    this._super.included.apply(this, arguments);

    // config
    let app = appOrAddon.app || appOrAddon;
    this.options = new Config(app, this.ui);

    // import webcomponentsjs polyfill library
    if (this.options.polyfillBundle && this.options.polyfillBundle !== 'none') {
      app.import(`${app.bowerDirectory}/webcomponentsjs/webcomponents-${this.options.polyfillBundle}.js`);
    }
  },

  // insert polymer and bundled elements
  contentFor(type, config) {
    if (type === 'head') {
      let href = path.join(config.rootURL, this.options.bundlerOutput);
      let content = `<link rel="import" href="${href}">`;

      if (this.options.globalPolymerSettings) {
        let settings = JSON.stringify(this.options.globalPolymerSettings);
        content += `<script> window.Polymer = ${settings}; </script>`
      }
      
      return content;
    }
  },

  postprocessTree(type, tree) {
    if (type !== 'all') {
      return tree;
    }

    // auto element import
    let bowerPath = path.join(this.options.projectRoot,
                                   this.project.bowerDirectory);
    let bowerPackages = scrapeDeps(this.project.bowerDependencies(),
                                   bowerPath, 'bower.json');
    let npmPackages = scrapeDeps(this.project.dependencies(),
                                 this.project.nodeModulesPath, 'package.json');
    let packages = bowerPackages.concat(npmPackages);
    let exclude = pkg => !this.options.excludeElements.includes(pkg.name);
    let elementPaths = packages.filter(exclude).map(pkg => pkg.elementPath);

    // manual element import
    let manualPackagePaths = extractDeps(this.options.htmlImportsFile);
    elementPaths = elementPaths.concat(manualPackagePaths);

    // check for duplicates
    elementPaths.filter((ep, i, eps) => eps.includes(ep, i + 1)).forEach(ep => {
      let relativePath = path.relative(this.options.projectRoot, ep);
      this.ui.writeInfoLine(`The html import \`${relativePath}\` was already ` +
                            `automatically imported ✨  You can remove this ` +
                            `import. (ember-polymer)`);
    });

    // write and bundle
    let filepath = path.basename(this.options.htmlImportsFile);
    let writer = new ElementWriter(elementPaths, filepath);
    let bundler = new ElementBundler(writer, {
      input: filepath,
      output: this.options.bundlerOutput
    }, this.options.bundlerOptions);

    // merge normal tree and our bundler tree
    return new MergeTrees([ tree, bundler ], {
      overwrite: true,
      annotation: 'Merge (ember-polymer merge bundler with addon tree)'
    });
  }
};
