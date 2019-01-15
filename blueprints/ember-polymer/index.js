/* eslint-env node */

module.exports = {
	normalizeEntityName() {}, // no-op since we're just adding deps

	afterInstall() {
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
