/* eslint-env node */
'use strict';
const Plugin = require('broccoli-plugin');
const path = require('path');

const RSVP = require('rsvp');
const mkdirp = require('mkdirp');
const clone = require('clone');
const fs = require('fs');

const { Bundler  } = require('polymer-bundler');
const { Analyzer, FSUrlLoader } = require('polymer-analyzer');
const parse5 = require('parse5');

module.exports = ElementBundler;
ElementBundler.prototype = Object.create(Plugin.prototype);
ElementBundler.prototype.constructor = ElementBundler;

function ElementBundler(inputTree, options) {
  if (!(this instanceof ElementBundler)) {
    return new ElementBundler(inputTree, options);
  }

  // Clone the options otherwise any alterations after this writer is called
  // will be picked up.
  this.options = clone(options) || {};
  this.inputTree = inputTree;
  this.outputFilepath = options.output || path.basename(options.input);
  Plugin.call(this, [inputTree]);
}

ElementBundler.prototype.bundle = function (options) {
  return new RSVP.Promise((resolve, reject) => {
    mkdirp(path.dirname(options.output), (error) => {
      if (error) {
        reject(error);
      }

      // FIXME do not use process.cwd to get relative project location,
      // but an options parameter instead.
      let relative = path.relative(process.cwd(), options.input);
      const analyzer = new Analyzer({
        urlLoader: new FSUrlLoader(path.resolve(process.cwd()))
      });

      const bundler = new Bundler({
        analyzer
      });
      bundler.generateManifest([ relative ]).then((manifest) => {
        bundler.bundle(manifest).then((result) => {
          let html = parse5.serialize(result.documents.get(relative).ast);

          fs.writeFileSync(options.output, html);
          resolve();
        }, (error) => reject(error)).catch((error) => reject(error));
      }, (error) => reject(error)).catch((error) => reject(error));
    });
  });
};

ElementBundler.prototype.build = function () {
  // We have to clone options again as bundle changes the hash which causes
  // the hash grow when called repeatedly.
  let options = clone(this.options);
  options.output = path.join(this.outputPath, this.outputFilepath);

  options.input = path.join(this.inputPaths[0], options.input);

  return this.bundle(options);
};
