/* eslint-env node */
'use strict';

const UI = require('console-ui');

module.exports = new UI({
	inputStream: process.stdin,
	outputStream: process.stdout,
	ci: true,
	writeLevel: 'ERROR'
});
