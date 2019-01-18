/* eslint-env node */
'use strict';
const path = require('path');

module.exports = class Config {
	constructor(app, ui) {
		this.ui = ui;

		// defaults
		this.autoElementImport = true;
		this.excludeElements = [];
		this.htmlImportsFile = path.join('app', 'elements.html');
		this.bundlerOutput = path.join('assets', 'bundled.html');
		this.bundlerOptions = {
			stripComments: true
		};
		this.polyfillBundle = 'lite';

		// retrieve and apply addon options
		const addonOptions = app.options['ember-cli-polymer-bundler'] || {};

		Object.assign(this, addonOptions);
		this.projectRoot = app.project.root;

		// convert relative path to absolute path
		this.htmlImportsFile = path.join(this.projectRoot, this.htmlImportsFile);
	}

	set bundlerOutput(bundlerOutput) {
		if (path.extname(bundlerOutput) === '.html') {
			this._bundlerOutput = bundlerOutput;
		} else {
			throw new Error('[ember-cli-polymer-bundler] The `bundlerOutput` file ' +
      `is not a .html file. You specified '${bundlerOutput}'`);
		}
	}

	get bundlerOutput() {
		return this._bundlerOutput;
	}

	set vulcanizeOutput(vulcanizeOutput) {
		this.ui.writeDeprecateLine('the `vulcanizeOutput` option was ' +
      'renamed to `bundlerOutput` and will be removed in 3.x (ember-cli-polymer-bundler)');
		this.bundlerOutput = vulcanizeOutput;
	}

	set vulcanizeOptions(vulcanizeOptions) {
		this.ui.writeDeprecateLine('the `vulcanizeOptions` option was ' +
      'renamed to `bundlerOptions` and will be removed in 3.x (ember-cli-polymer-bundler)');
		this.bundlerOptions = vulcanizeOptions;
	}
};
