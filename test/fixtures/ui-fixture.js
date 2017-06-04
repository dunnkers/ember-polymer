/* jshint node: true */
'use strict';

let UI = require('console-ui');

module.exports = new UI({
  inputStream: process.stdin,
  outputStream: process.stdout
});
