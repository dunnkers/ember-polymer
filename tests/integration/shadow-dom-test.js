import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

module('Integration | Polymer | Shadow DOM', function(hooks) {
  setupRenderingTest(hooks);

  test('Uses native Shadow DOM if available', async function(assert) {
    if (!window.Polymer.Settings.nativeShadow) {
      return assert.expect(0);
    }

    assert.expect(2);

    await render(hbs`<paper-button></paper-button>`);

    assert.ok(document.querySelector('paper-button').shadowRoot,
      'paper-button has shadowRoot');
    assert.equal($('paper-button').attr('role'), 'button',
      'role is attached to button immediately');
  });
});
