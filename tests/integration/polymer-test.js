import { module, test } from 'qunit';

module('Integration | Polymer | Polymer exists in window');

test('window.Polymer should exist', function(assert) {
  assert.ok(window.Polymer, 'window.Polymer exists');
});

test('Polymer should be configured to use Shadow DOM', function(assert) {
  assert.equal(window.Polymer.Settings.dom, 'shadow',
    'dom is set to shadow in Polymer settings');
});

test('window.WebComponents should exist', function(assert) {
  assert.ok(window.WebComponents, 'window.WebComponents exists');
});
