/* eslint-env node */
'use strict';
const Plugin = require('broccoli-plugin');
const path = require('path');
const fs = require('fs-extra');

module.exports = class ElementWriter extends Plugin {
	constructor(elementPaths, filename) {
		super([], {
			name: 'Element Writer',
			annotation: 'Writes html imports to a file, ready to be bundled'
		});
		this.elementPaths = elementPaths;
		this.filename = filename;
	}

	build() {
		const imports = this.elementPaths.map((elementPath) => {
			const href = path.relative(this.outputPath, elementPath);

			return `<link rel="import" href="${href}">`;
		}).join('\n');

		return fs.outputFile(path.join(this.outputPath, this.filename), imports);
	}
};
