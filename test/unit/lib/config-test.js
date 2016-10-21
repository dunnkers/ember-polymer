/* jshint node: true */
'use strict';

var assert = require('assert');

describe('the addon config file', function() {
  var Config;

  before(function() {
    Config = require('../../../lib/config');
  });

  it('loads it', function() {
    let config = new Config({
      options: {
        'ember-polymer': {

        }
      },
      project: {
        root: '/'
      }
    });

    assert.equal(config.htmlImportsFile, '/app/elements.html');
  });
});
