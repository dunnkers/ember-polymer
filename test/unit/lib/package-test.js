/* eslint-env node */
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

  it.skip('should be able to take a complete path as input', function() {

  });
});
