/* jshint node: true */
'use strict';
const Analyzer = require('polymer-analyzer').Analyzer;
const FSUrlLoader = require('polymer-analyzer/lib/url-loader/fs-url-loader').FSUrlLoader;
const PackageUrlResolver =
  require('polymer-analyzer/lib/url-loader/package-url-resolver').PackageUrlResolver;
const urlResolver = new PackageUrlResolver();
const element = 'paper-input';

let analyzer = new Analyzer({
  // for some reason, we do not need to prefix this url with `../`
  urlLoader: new FSUrlLoader(`bower_components/${element}/`),
  urlResolver: urlResolver,
});

function mapAs(list, property) {
  return list.map((item) => item[property]);
}

function timer(since) {
  let diff = Date.now() - since;
  return `(+ ${diff}ms)`;
}

module.exports = class ComponentInjector {
  inject(/* app */) {
    let since = Date.now();

    console.log('analyzing element... %s', timer(since));
    analyzer.analyze([ `${element}.html` ])
      .then((document) => {
        console.log('retrieved document! %s', timer(since));
        return document.getFeatures();
      }, function(error) {
        console.log('errorr=', error);
      }).then((features) => {
        console.log('retrieved features! %s\n', timer(since));
        console.log('\nfeatures');

        for (let feature of features) {
          if (feature.constructor.name === 'PolymerElement') {
            console.log('\n\nfeature `%s`', feature.tagName);

            console.log('\nproperties');
            console.log(mapAs(feature.properties, 'name'));

            console.log('\nattributes');
            console.log(mapAs(feature.attributes, 'name'));

            console.log('\nevents');
            console.log(mapAs(feature.events, 'name'));

            console.log('\nbehaviorAssignments');
            console.log(mapAs(feature.behaviorAssignments, 'name'));
          }
        }
      });
  }
};
