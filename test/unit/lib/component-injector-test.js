/* jshint node: true */
'use strict';

let assert = require('assert');
let app = require('../../fixtures/app-fixture');

describe('component-injector', function() {
  let ComponentInjector;

  before(function() {
    ComponentInjector = require('../../../lib/component-injector');
  });

  it('loads it', function() {
    this.componentInjector = new ComponentInjector();
    assert.ok(this.componentInjector);
  });

  it('can inject components', function() {
    this.componentInjector.inject(app);
  });
});
