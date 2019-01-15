import { module, test } from 'qunit';

module('Integration | Polymer | Polymer exists in window', () => {
	test('window.Polymer should exist', (assert) => {
		assert.ok(window.Polymer, 'window.Polymer exists');
	});

	test('window.WebComponents should exist', (assert) => {
		assert.ok(window.WebComponents, 'window.WebComponents exists');
	});
});
