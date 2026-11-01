// Jest setup for `wp-scripts test-unit-jest` (@wordpress/scripts >= 37 no
// longer ships Jest defaults). See node_modules/@wordpress/scripts/docs/vitest-migration.md
module.exports = {
	preset: '@wordpress/jest-preset-default',
	transform: {
		'\\.[cm]?[jt]sx?$': [
			'babel-jest',
			{ presets: [ '@wordpress/babel-preset-default' ] },
		],
	},
	// ES modules used by @wordpress packages must be transformed.
	transformIgnorePatterns: [ 'node_modules/(?!(parsel-js|uuid|marked|@wordpress|@ariakit|is-plain-obj)/)' ],
};
