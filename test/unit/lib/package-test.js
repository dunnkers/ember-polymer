/* jshint node: true */
'use strict';

let assert = require('assert');

describe('package', function() {
  let Package;

  before(function() {
    Package = require('../../../lib/package');
  });

  it('loads it', function() {
    this.package = new Package('bower_components', 'paper-elements', 'bower.json');
    assert.ok(this.package);
  });

  it('gets elementPath', function() {
    assert.equal(this.package.elementPath,
      'bower_components/paper-elements/paper-elements.html');
  });

  it('gets packagePath', function() {
    assert.equal(this.package.packagePath,
      'bower_components/paper-elements/bower.json');
  });

  it('gets allImports', function() {
    assert.equal(this.package.allImports,
      'bower_components/paper-elements/all-imports.html');
  });

  it('gets linkPath', function() {
    assert.equal(this.package.linkPath, `../../${this.package.elementPath}`);
  });

  it('gets linkPath as all-imports if present', function() {
    let pkg = new Package('bower_components', 'paper-input', 'bower.json');
    assert.equal(pkg.linkPath, `../../${pkg.allImports}`);
  });

  it.skip('sets linkPath relative to htmlImportsDir', function() {
    this.options.htmlImportsDir = 'tmp/some-dir/another-dir';
    assert.equal(this.package.linkPath, `../../../${this.package.elementPath}`);
  });

  it('gets link', function() {
    assert.equal(this.package.link,
      `<link rel="import" href="${this.package.linkPath}">`);
  });

  it('checks whether web-components keyword is apparent', function() {
    this.package.pkgFile = 'non-existant.json';
    assert.equal(this.package.hasWebComponentsKeyword(), false);

    this.package.pkgFile = 'bower.json';
    assert.equal(this.package.hasWebComponentsKeyword(), true);

    let pkg = new Package('bower_components', 'ember', 'bower.json');
    assert.equal(pkg.hasWebComponentsKeyword(), false);
  });

  it('checks whether it is a web component', function() {
    assert.equal(this.package.isWebComponent(), true);

    let pkg = new Package('bower_components', 'ember', 'bower.json');
    assert.equal(pkg.isWebComponent(), false);
  });

  it.skip('should be able to take a complete path as input', function() {

  });
});
