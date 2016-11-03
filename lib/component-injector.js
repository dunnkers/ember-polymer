/* jshint node: true */
'use strict';
const Analyzer = require('polymer-analyzer').Analyzer;
const FSUrlLoader = require('polymer-analyzer/lib/url-loader/fs-url-loader').FSUrlLoader;
const PackageUrlResolver =
  require('polymer-analyzer/lib/url-loader/package-url-resolver').PackageUrlResolver;
const urlResolver = new PackageUrlResolver();
const element = 'paper-checkbox';

let analyzer = new Analyzer({
  // for some reason, we do not need to prefix this url with `../`
  urlLoader: new FSUrlLoader(`bower_components/${element}/`),
  urlResolver: urlResolver,
});

module.exports = class ComponentInjector {
  inject(/* app */) {
    console.log('analyzing element...');
    analyzer.analyze(`${element}.html`)
      .then((document) => {
        return document.getFeatures();
      }, function(error) {
        console.log('errorr=', error);
      }).then((features) => {
        for (let feature of features) {
          console.log(feature.constructor.name);
          if (feature.constructor.name === 'PolymerElement') {
            console.log('feature\n');
            console.log(feature);

            console.log('\n\n\nproperties\n');
            console.log(feature.properties);

            console.log('\n\n\nattributes\n');
            console.log(feature.attributes);

            console.log('\n\n\nevents\n');
            console.log(feature.events);

            console.log('\n\n\nbehaviorAssignments\n');
            console.log(feature.behaviorAssignments);
          }
        }
        // console.log('duder.', features);
      });
  }
};
