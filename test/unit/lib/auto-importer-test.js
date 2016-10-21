/* jshint node: true */
'use strict';

var assert = require('assert');

describe('auto-importer', function() {
  var AutoImporter;

  before(function() {
    AutoImporter = require('../../../lib/auto-importer');
  });

  it('loads it', function() {
    assert.ok(AutoImporter);
  });
});
