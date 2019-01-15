/* eslint-env node */
'use strict';

const assert = require('assert');
const extractor = require('../../../lib/extractor');

describe('extractor', () => {
	it('returns empty array when invalid filepath supplied', () => {
		const res = extractor('some-non-existant-file.html');

		assert.deepStrictEqual(res, []);
	});

	it('finds paths even when html file is distorted', () => {
		const res = extractor('node-tests/fixtures/nonnormalized-elements.html');

		assert.deepStrictEqual(res, [
			'node-tests/fixtures/bower_components_fixture/paper-elements/paper-elements.html',
			'node-tests/fixtures/bower_components_fixture/iron-icons/iron-icons.html'
		]);
	});
});
