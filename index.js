/* jshint node: true */
'use strict';
let fs = require('fs');
let readFile = fs.readFileSync;
let fileExists = fs.existsSync;
let writeFile = fs.writeFileSync;
let path = require('path');
let MergeTrees = require('broccoli-merge-trees');
let Vulcanize = require('broccoli-vulcanize');
var quickTemp = require('quick-temp');

const defaultVulcanizeOptions = {
  inlineCss: true,
  inlineScripts: true
};

class Package {
  constructor(dir, name) {
    this.dir = dir;
    this.name = name;
  }

  get path() {
    return path.join(this.dir, this.name);
  }

  get link() {
    let allImportsPath = path.join(this.path, 'all-imports.html');
    let elementPath = path.join(this.path, `${this.name}.html`);
    let linkPath = fileExists(allImportsPath) ? allImportsPath : elementPath;
    linkPath = path.join('..', '..', linkPath);

    return `<link rel="import" href="${linkPath}">`;
  }
}

function getPackages(dependencies, dir, packageFile) {
  return Object.keys(dependencies).map((name) => {
    if (isWebComponent(dir, name, packageFile)) {
      return new Package(dir, name);
    } else {
      return false;
    }
  }).filter((pkg) => !!pkg);
}

function hasWebComponentsKeyword(path) {
  if (!fileExists(path)) {
    return false;
  }

  let json = JSON.parse(readFile(path));
  return json && json.keywords && json.keywords.includes('web-components');
}

function isWebComponent(dir, name, packageFile) {
  let elementPath = path.join(dir, name, `${name}.html`);

  return fileExists(elementPath) && hasWebComponentsKeyword(path.join(
    dir, name, packageFile
  ));
}

module.exports = {
  name: 'ember-polymer',

  init: function() {
    if (this._super.init) {
      this._super.init.apply(this, arguments);
    }

    let bowerPackages = getPackages(this.project.bowerDependencies(),
      this.project.bowerDirectory, 'bower.json');
    let npmPackages = getPackages(this.project.dependencies(),
      path.basename(this.project.nodeModulesPath), 'package.json');
    this.elementsToImport = bowerPackages.concat(npmPackages);
  },

  included: function(appOrAddon) {
    this._super.included.apply(this, arguments);

    let app = appOrAddon.app || appOrAddon;
    let addonOptions = app.options['ember-polymer'] || {};

    this.htmlImportsFile = addonOptions.htmlImportsFile ||
      path.join('app', 'elements.html');
    this.vulcanizeOutput = addonOptions.vulcanizeOutput ||
      path.join('assets', 'vulcanized.html');
    this.vulcanizeOptions = Object.assign(defaultVulcanizeOptions,
      addonOptions.vulcanizeOptions);
    this.projectTree = app.trees.app;
    this.autoElementImport = addonOptions.autoElementImport || true;
    this.excludeElements = addonOptions.excludeElements || [];

    if (this.autoElementImport) {
      this.elementsToImport = this.elementsToImport.filter(
        (pkg) => !!pkg && !this.excludeElements.includes(pkg.name));
      this.elementsToImport = this.elementsToImport.map((pkg) => pkg.link);

      // create a temporary directory to store html imports in.
      quickTemp.makeOrRemake(this, 'tmpImportsDir');

      // write element imports to temporary file
      writeFile(path.join(this.tmpImportsDir, 'html-imports.html'),
                this.elementsToImport.join('\n'));
      this.projectTree = this.tmpImportsDir;
      this.htmlImportsFile = path.join(this.tmpImportsDir, 'html-imports.html');
    }

    app.import(app.bowerDirectory + '/webcomponentsjs/webcomponents.min.js');
  },

  // insert polymer and vulcanized elements
  contentFor: function(type) {
    if (type === 'head') {
      return `<script>
                window.Polymer = window.Polymer || {};
                window.Polymer.dom = "shadow";
              </script>
              <link rel="import" href="/${this.vulcanizeOutput}">`;
    }
  },

  postprocessTree: function(type, tree) {
    if (type === 'all') {
      if (path.extname(this.vulcanizeOutput) !== '.html') {
        throw new Error('[ember-polymer] The `vulcanizeOutput` file ' +
          `is not a .html file. You specified '${this.vulcanizeOutput}'`);
      }

      let filePath = path.join(this.app.project.root,
                               this.htmlImportsFile);

      if (this.autoElementImport || fileExists(filePath)) {
        // vulcanize html files, starting at specified html imports file
        let options = Object.assign(this.vulcanizeOptions, {
          input: path.basename(this.htmlImportsFile),
          output: this.vulcanizeOutput,
          stripExcludes: ['.*paper-styles\.html.*']
        });

        let vulcanized = new Vulcanize(this.projectTree, options);

        return new MergeTrees([ tree, vulcanized ], {
          overwrite: true,
          annotation: 'Merge (ember-polymer merge vulcanized with addon tree)'
        });
      } else {
        this.ui.writeWarnLine('[ember-polymer] No html imports file ' +
          `exists at '${this.htmlImportsFile}'`);
      }
    }

    return tree;
  }
};
