/* eslint-env node */

module.exports = {
  normalizeEntityName: function() {}, // no-op since we're just adding deps

  afterInstall: function() {
    return this.addBowerPackagesToProject([{
      name: 'polymer'
    }, {
      name: 'webcomponentsjs'
    }]);
  }
};
