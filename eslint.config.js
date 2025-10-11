module.exports = [
	{
		files: ['**/*.ts', '**/*.js'],
		ignores: ['dist/**', 'node_modules/**', 'index.js'],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			parser: require('@typescript-eslint/parser'),
		},
		plugins: {
			'@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'no-console': 'warn',
		},
	},
];