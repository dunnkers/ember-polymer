/* eslint-env node */
'use strict';
const fs = require('fs');
const fileExists = fs.existsSync;
const path = require('path');

module.exports = (deps, dir, pkgFilename) => {
  return Object.keys(deps).reduce((stack, name) => {
    let elementPath = path.join(dir, name, `${name}.html`);
    let allPath     = path.join(dir, name, 'all-imports.html');
    let pkg = require(path.join(dir, name, pkgFilename));

    if (pkg.keywords && pkg.keywords.includes('web-components')
                     && fileExists(elementPath)) {
      elementPath = fileExists(allPath) ? allPath : elementPath;

      stack.push({ name, elementPath });
    }

    return stack;
  }, []);
};
