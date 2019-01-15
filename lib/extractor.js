/* eslint-disable no-sync */
'use strict';

const fs = require('fs');
const readFile = fs.readFileSync;
const fileExists = fs.existsSync;
const path = require('path');
const parse5 = require('parse5');

module.exports = (filepath) => {
	if (!fileExists(filepath)) {
		return [];
	}

	const file = readFile(filepath, 'utf8');
	const dir = path.dirname(filepath);

	const fragment = parse5.parseFragment(file);
	const link = (node) => node.tagName === 'link';
	const href = (attr) => attr.name === 'href';

	return fragment.childNodes.filter(link).map((node) => {
		const relativePath = node.attrs.find(href).value;

		return path.join(dir, relativePath);
	});
};
