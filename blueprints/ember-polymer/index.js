/* eslint-env node */

module.exports = {
  normalizeEntityName: function() {}, // no-op since we're just adding deps

  afterInstall: function() {
      return this.addBowerPackagesToProject([
        {
          name: 'polymer',
          target: '^2.6.0'
        },
        {
          name: 'webcomponentsjs',
          target: '^1.2.0'
        }
      ]);
  }
};
