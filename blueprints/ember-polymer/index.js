/* eslint-env node */

module.exports = {
  normalizeEntityName: function() {}, // no-op since we're just adding deps

  afterInstall: function() {
      return this.addBowerPackagesToProject([{
      name: 'polymer',
      target: '1.9.1'
    }, {
      name: 'webcomponentsjs',
      target: '0.7.24'
    }]);
  }
};
