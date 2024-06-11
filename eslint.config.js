import antfu from '@antfu/eslint-config'

export default antfu({
	formatters: true,
	svelte: true,

	stylistic: {
		indent: 'tab',
		quotes: 'single',
	},

	ignores: [],
})
