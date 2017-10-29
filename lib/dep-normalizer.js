/* eslint-env node */
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

  let file = readFile(filepath, 'utf8');
  let dir = path.dirname(filepath);

  const fragment = parse5.parseFragment(file);
  let link  = (node) => node.tagName == 'link';
  let attr  = (attr) => attr.name == 'href';

  return fragment.childNodes.filter(link).map((node) => {
    let relativePath = node.attrs.find(attr).value;

    return path.join(dir, relativePath);
  });
};
