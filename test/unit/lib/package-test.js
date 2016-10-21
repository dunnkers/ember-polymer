/* jshint node: true */
'use strict';

var assert = require('assert');

describe('package', function() {
  var Package;

  before(function() {
    Package = require('../../../lib/package');
  });

  it('loads it', function() {
    assert.ok(Package);
  });
});
