/* eslint-env node */
'use strict';

let assert = require('assert');
let path = require('path');
const scraper = require('../../../lib/scraper');
let project = require('../../fixtures/project-fixture');

describe('scraper', function () {
    it('scrapes custom elements from local packages', function () {
        let res = scraper(project.bowerDependencies(), 
                          path.join(process.cwd(), project.bowerDirectory),
                          'bower.json');
        
        let appcwd = (str) => path.join(process.cwd(), str);
        assert.deepEqual(res, [
            {
                "elementPath": appcwd("test/fixtures/bower_components_fixture/iron-icons/iron-icons.html"),
                "name": "iron-icons"
            },
            {
                "elementPath": appcwd("test/fixtures/bower_components_fixture/paper-elements/paper-elements.html"),
                "name": "paper-elements"
            }
        ]);
    });
});
