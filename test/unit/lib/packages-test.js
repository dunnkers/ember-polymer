/* eslint-env node */
'use strict';

let assert = require('assert');
let Package = require('../../../lib/package');
let project = require('../../fixtures/project-fixture');

describe('packages', function() {
  let Packages;

  before(function() {
    Packages = require('../../../lib/packages');

    this.webComponentPackages = [
      new Package(project.bowerDirectory, 'paper-elements', 'bower.json'),
      new Package(project.bowerDirectory, 'iron-icons', 'bower.json')
    ];
  });

  it('loads it', function() {
    this.packages = new Packages(project);
    assert.ok(this.packages);
  });

  it('should be able to detect web-component packages', function() {
    let pkg = new Package(project.bowerDirectory, 'moment', 'bower.json');
    // FIXME check for pkg existance first (!)
    assert.equal(this.packages.isWebComponent(pkg), false);

    pkg.name = 'paper-elements';
    assert.equal(this.packages.isWebComponent(pkg), true);

    pkg.pkgFile = 'non-existant.json';
    assert.equal(this.packages.isWebComponent(pkg), false);
  });

  it('returns only bower packages that are a web-component', function() {
    let packages = this.packages.getWebComponentPackages(
      project.bowerDependencies(), project.bowerDirectory, 'bower.json');
    assert.deepEqual(packages, this.webComponentPackages);
  });

  it('returns only npm- and bower packages that are web-components', function() {
    let packages = this.packages.getPackages();
    assert.deepEqual(packages, this.webComponentPackages);
  });

  it('correctly excludes packages', function() {
    this.packages.options.excludeElements = [ 'paper-elements', 'iron-icons' ];
    let packages = this.packages.getPackages();
    assert.deepEqual(packages, []);
    this.packages.options.excludeElements = [];
  });
});
