/* jshint node: true */
'use strict';

var assert = require('assert');

describe('manual-importer', function() {
  var ManualImporter;

  before(function() {
    ManualImporter = require('../../../lib/manual-importer');
  });

  it('loads it', function() {
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
});
