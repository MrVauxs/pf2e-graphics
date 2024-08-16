import antfu from '@antfu/eslint-config'

export default antfu(
	{
		formatters: true,
		svelte: true,

		stylistic: {
			indent: 'tab',
			quotes: 'single',
			// semi: true
		},

		rules: {
			'svelte/html-self-closing': [
				'error',
				'all',
			],
			'svelte/prefer-style-directive': 'warn',
			'antfu/consistent-list-newline': 'warn',
			'antfu/if-newline': 'off',
			'import/no-mutable-exports': 'off',
			'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
			'unused-imports/no-unused-vars': 'warn',
			'node/prefer-global/process': 'off',
			'svelte/valid-compile': 'warn',
		},

		ignores: [],
	},
	{
		files: ['**/*.svelte'],
		rules: {
			'no-self-assign': 'off',
		},
	},
)
