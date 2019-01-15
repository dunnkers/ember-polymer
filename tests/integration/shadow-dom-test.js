import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

module('Integration | Polymer | Shadow DOM', (hooks) => {
	setupRenderingTest(hooks);

	test('Uses native Shadow DOM if available', async(assert) => {
		if (!window.Polymer.Settings.nativeShadow) {
			assert.expect(0);
			return;
		}

		assert.expect(2);

		await render(hbs`<paper-button></paper-button>`);

		assert.ok(document.querySelector('paper-button').shadowRoot,
			'paper-button has shadowRoot');
		assert.equal($('paper-button').attr('role'), 'button',
			'role is attached to button immediately');
	});
});
