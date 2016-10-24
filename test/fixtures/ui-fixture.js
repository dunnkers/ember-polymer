/* jshint node: true */
'use strict';

let UI = require('ember-cli/lib/ui/index');

module.exports = new UI({
  inputStream: process.stdin,
  outputStream: process.stdout
});
