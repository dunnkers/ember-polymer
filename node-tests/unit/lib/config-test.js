/* eslint-env node */
'use strict';

const assert = require('assert');
const app = require('../../fixtures/app-fixture');
const ui = require('../../fixtures/ui-fixture');

describe('config', () => {
	let Config;

	before(() => {
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
		const out = 'some/output/path.html';

		this.options.vulcanizeOutput = out;

		assert.strictEqual(this.options.bundlerOutput, out);
	});

	it('vulcanizeOptions is deprecation is handled', function() {
		const opts = {
			some: 'options'
		};

		this.options.vulcanizeOptions = opts;

		assert.strictEqual(this.options.bundlerOptions, opts);
	});
});
