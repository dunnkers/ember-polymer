import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | Polymer | index', (hooks) => {
	setupApplicationTest(hooks);

	test('renders custom elements', async(assert) => {
		await visit('/');
		assert.expect(3);

		assert.equal(currentURL(), '/');
		const done = assert.async();

		const testElement = () => {
			const button = document.querySelector('paper-button');

			assert.ok(button.shadowRoot || button.shadyRoot,
				'paper-button has shadowRoot');

			assert.equal(button.getAttribute('role'), 'button',
				'paper-button rendered successfully');

			done();
		};

		if (window.Polymer.Settings.nativeShadow || window.WebComponents.ready) {
			testElement();
		} else {
			// wait for elements to be polyfilled
			window.addEventListener('WebComponentsReady', testElement);
		}
	});
});
