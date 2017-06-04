/* eslint-env node */
'use strict';

let assert = require('assert');
// libs
let Config = require('../../../lib/config');
let Packages = require('../../../lib/packages');
// fixtures
let app = require('../../fixtures/app-fixture');
let project = require('../../fixtures/project-fixture');
let ui = require('../../fixtures/ui-fixture.js');

describe('manual-importer', function() {
  let ManualImporter;

  before(function() {
    ManualImporter = require('../../../lib/manual-importer');
    app.project.root = process.cwd();
    this.options = new Config(app);
  });

  it('loads it', function() {
    this.packages = new Packages(project);
    let packages = this.packages.getPackages();

    this.manualImporter = new ManualImporter(this.options, ui, packages);
    assert.ok(ManualImporter);
  });

  it.skip('determines whether package already imported', function() {

  });

  it.skip('fixes manual import path', function() {

  });

  it.skip('fixes manual import when htmlImportsDir not at (../../)', function() {

  });

  it.skip('gets imports', function() {

  });

  it.skip('completely removes imports instead of replacing the line', function() {

  });

  it('also imports all other html inside the htmlImportsFile', function() {
      this.options.htmlImportsFile = 'test/fixtures/style-element.html';
      let elements = this.manualImporter.getImports();
      assert.equal(elements, `<style is="custom-style" include="iron-flex"></style>
`);
  });
});
