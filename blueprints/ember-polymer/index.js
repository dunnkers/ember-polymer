/* eslint-env node */

module.exports = {
  normalizeEntityName: function() {}, // no-op since we're just adding deps

  afterInstall: function() {
      return this.addBowerPackagesToProject([
        {
          name: 'polymer',
          target: '^2.3.1'
        },
        {
          name: 'webcomponentsjs',
          target: '^1.0.22'
        }
      ]);
  }
};
