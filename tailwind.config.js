/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				serif: ['var(--serif-condensed)', 'serif'],
			},
		},
	},
	corePlugins: {
		preflight: false,
	},
	important: '.pf2e-g',
	plugins: [],
}
