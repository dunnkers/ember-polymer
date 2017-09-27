/* eslint-env node */
'use strict';
const Plugin = require('broccoli-plugin');
const path = require('path');

const RSVP = require('rsvp');
const PolymerBundler = require('polymer-bundler');
const mkdirp = require('mkdirp');
const clone = require('clone');
const parse5 = require('parse5');

module.exports = Bundler;
Bundler.prototype = Object.create(Plugin.prototype);
Bundler.prototype.constructor = Bundler;

function Bundler(inputTree, options) {
  if (!(this instanceof Bundler)) {
    return new Bundler(inputTree, options);
  }

  // Clone the options otherwise any alterations after this writer is called
  // will be picked up.
  this.options = clone(options) || {};
  this.inputTree = inputTree;
  this.outputFilepath = options.output || path.basename(options.input);
  Plugin.call(this, [inputTree]);
}

Bundler.prototype.bundle = function (options) {
  return new RSVP.Promise(function (resolve, reject) {
    mkdirp(path.dirname(options.output), function (error) {
      if (error) {
        reject(error);
      }

      console.log(options.input);

      const bundler = new PolymerBundler.Bundler(options);
      bundler.generateManifest([options.input]).then((manifest) => {
        bundler.bundle(manifest).then((result) => {
          console.log('<!-- BUNDLED VERSION OF elements.html: -->');
          console.log(parse5.serialize(result.documents.get('elements.html').ast));
          resolve();
        }, (error) => reject(error)).catch((error) => reject(error));
      }, (error) => reject(error)).catch((error) => reject(error));
      // new Vulcan(options).process(options.input, function (error, html) {
      //   if (error) {
      //     reject(error);
      //   }

      //   fs.writeFileSync(options.output, html);
      //   resolve();
      // });
    });
  });
};

Bundler.prototype.build = function () {
  // We have to clone options again as bundle changes the hash which causes
  // the hash grow when called repeatedly.
  let options = clone(this.options);
  options.output = path.join(this.outputPath, this.outputFilepath);

  options.input = path.join(this.inputPaths[0], options.input);

  return this.bundle(options);
};
