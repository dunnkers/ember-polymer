/* eslint-env node */
'use strict';

let assert = require('assert');
let path = require('path');
const { scrapeDeps, isWebComponent } = require('../../../lib/scraper');
let project = require('../../fixtures/project-fixture');

describe('scraper', function () {
    it('recognizes web component with keywords', function () {
        let pkg = require('../../fixtures/bower_components_fixture/iron-icons/bower.json');
        assert.ok(isWebComponent(pkg));
    });

    it('recognizes web component with main field', function () {
        let pkg = require('../../fixtures/bower_components_fixture/js-seo/bower.json');
        assert.ok(isWebComponent(pkg));
    });

    it('recognizes package as non-webcomponent', function () {
        let pkg = require('../../fixtures/bower_components_fixture/paper-button/bower.json');
        assert.equal(isWebComponent(pkg), false);
    });

    it.skip('recognizes web component with webcomponents.org badge', function () {
        let pkg = require('../../fixtures/bower_components_fixture/canvas-datagrid/bower.json');
        assert.ok(isWebComponent(pkg));
    });

    it('scrapes custom elements from local packages', function () {
        let res = scrapeDeps(project.bowerDependencies(), 
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
            },
            {
                "elementPath": appcwd("test/fixtures/bower_components_fixture/js-seo/js-seo.html"),
                "name": "js-seo"
            }
        ]);
    });
});
