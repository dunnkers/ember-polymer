/* eslint-env node */
'use strict';

let assert = require('assert');
const extractor = require('../../../lib/extractor');

describe('extractor', function () {
    it('returns empty array when invalid filepath supplied', function () {
        let res = extractor('some-non-existant-file.html');
        assert.deepEqual(res, []);
    });
    
    it('finds paths even when html file is distorted', function () {
        let res = extractor('test/fixtures/nonnormalized-elements.html');
        assert.deepEqual(res, [
            'test/fixtures/bower_components_fixture/paper-elements/paper-elements.html',
            'test/fixtures/bower_components_fixture/iron-icons/iron-icons.html'
        ]);
    });
});
