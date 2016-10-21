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
});
