/* eslint-env node */
'use strict';

const assert = require('assert');
const path = require('path');
const { scrapeDeps, isWebComponent } = require('../../../lib/scraper');
const project = require('../../fixtures/project-fixture');

describe('scraper', () => {
	it('recognizes web component with keywords', () => {
		const pkg = require('../../fixtures/bower_components_fixture/iron-icons/bower.json');

		assert.ok(isWebComponent(pkg));
	});

	it('recognizes web component with main field', () => {
		const pkg = require('../../fixtures/bower_components_fixture/js-seo/bower.json');

		assert.ok(isWebComponent(pkg));
	});

	it('recognizes package as non-webcomponent', () => {
		const pkg = require('../../fixtures/bower_components_fixture/paper-button/bower.json');

		assert.strictEqual(isWebComponent(pkg), false);
	});

	it.skip('recognizes web component with webcomponents.org badge', () => {
		const pkg = require('../../fixtures/bower_components_fixture/canvas-datagrid/bower.json');

		assert.ok(isWebComponent(pkg));
	});

	it('scrapes custom elements from local packages', () => {
		const res = scrapeDeps(project.bowerDependencies(),
			path.join(process.cwd(), project.bowerDirectory),
			'bower.json');

		const appcwd = (str) => path.join(process.cwd(), str);

		assert.deepStrictEqual(res, [
			{
				elementPath: appcwd('node-tests/fixtures/bower_components_fixture/iron-icons/iron-icons.html'),
				name: 'iron-icons'
			},
			{
				elementPath: appcwd('node-tests/fixtures/bower_components_fixture/paper-elements/paper-elements.html'),
				name: 'paper-elements'
			},
			{
				elementPath: appcwd('node-tests/fixtures/bower_components_fixture/js-seo/js-seo.html'),
				name: 'js-seo'
			}
		]);
	});
});
