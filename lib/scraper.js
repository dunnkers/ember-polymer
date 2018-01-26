/* eslint-env node */
'use strict';
const fs = require('fs');
const fileExists = fs.existsSync;
const path = require('path');

exports.isWebComponent = (pkg) => {
  let { keywords, main } = pkg;
  let hasAnyKeyword = keywords && (keywords.includes('web-component') ||
    keywords.includes('web-components'));
  let hasEntryPoint = main && main.includes(`${pkg.name}.html`);
  // TODO has package `webcomponents.org published` badge

  return [ hasAnyKeyword, hasEntryPoint ].some(t => t);
};

exports.scrapeDeps = (deps, dir, pkgFilename) =>
  Object.keys(deps).reduce((stack, name) => {
    let elementPath = path.join(dir, name, `${name}.html`);
    let pkgPath = path.join(dir, name, pkgFilename);

    // fail softly for the rare case where project has no package file defined
    if (!fileExists(pkgPath)) return stack;

    let pkg = require(pkgPath);

    // verify whether webcomponent and entrypoint existance
    if (exports.isWebComponent(pkg) && fileExists(elementPath)) {
      let allPath = path.join(dir, name, 'all-imports.html');
      elementPath = fileExists(allPath) ? allPath : elementPath;
      stack.push({ name, elementPath });
    }

    return stack;
  }, []);
