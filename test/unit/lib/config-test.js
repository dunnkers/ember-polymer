/* eslint-env node */
'use strict';

let assert = require('assert');
let app = require('../../fixtures/app-fixture');
let ui = require('../../fixtures/ui-fixture');

describe('config', function() {
  let Config;

  before(function() {
    Config = require('../../../lib/config');
  });

  it('loads it', function() {
    app.project.root = process.cwd();
    this.options = new Config(app, ui);
    assert.ok(this.options);
  });

  it('loads it with options', function() {
    app.options['ember-polymer'] = {
      bundlerOptions: {
        stripExcludes: ['.*paper-styles.html.*']
      }
    };

    this.options = new Config(app, ui);
    assert.ok(this.options);
  });

  it('wrong bundlerOutput extension throws an error', function() {
    assert.throws(() => {
      this.options.bundlerOutput = 'elements.wrongextension';
    }, Error);
  });

  it('vulcanizeOutput is deprecation is handled', function() {
    let out = 'some/output/path.html';
    this.options.vulcanizeOutput = out;
    
    assert.equal(this.options.bundlerOutput, out);
  });

  it('vulcanizeOptions is deprecation is handled', function() {
    let opts = {
      some: 'options'
    };
    this.options.vulcanizeOptions = opts;

    assert.equal(this.options.bundlerOptions, opts);
  });
});
