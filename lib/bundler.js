/* eslint-env node */
'use strict';
const Plugin = require('broccoli-plugin');
const path = require('path');
const fs = require('fs-extra');
const { Bundler } = require('polymer-bundler');
const { Analyzer, FSUrlLoader } = require('polymer-analyzer');
const parse5 = require('parse5');

module.exports = class ElementBundler extends Plugin {
	constructor(inputNode, options = {}, bundlerOptions = {}) {
		super([inputNode], {
			name: 'Element Bundler',
			annotation: 'Bundles Polymer elements using polymer-bundler'
		});

		this.root = '/'; // use cwd by default
		Object.assign(this, options);
		this.output = this.output || this.input;

		if (!this.input) {
			throw new Error('[ember-polymer-bundler] No input path found! 😵');
		}

		this.bundlerOptions = bundlerOptions;
		this.bundlerOptions.analyzer = bundlerOptions.analyzer || new Analyzer({
			urlLoader: new FSUrlLoader(path.resolve(this.root))
		});
	}

	build() {
		const bundler = new Bundler(this.bundlerOptions);
		const abspath = path.join(this.inputPaths[0], this.input);
		const entry = path.relative(this.root, abspath);
		const outpath = path.join(this.outputPath, this.output);

		// generateManifest takes urls relative to root
		return bundler.generateManifest([entry])
			.then((manifest) => bundler.bundle(manifest)).then((result) => {
				const html = parse5.serialize(result.documents.get(entry).ast);

				return fs.outputFile(outpath, html);
			}).catch((err) => {
				throw new Error(`ember-polymer bundler.bundle() failure: ${err}`);
			});
	}
};
