/* eslint-disable no-console */
export class ErrorMsg extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'PF2e Graphics Error'

		ui.notifications.error(`PF2e Graphics | ${i18n(message)}`)
	}
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined
}

export let dev = import.meta.env.DEV
Hooks.on('ready', () => {
	if (!dev) dev = game.settings.get('pf2e-graphics', 'dev') as boolean
})

export function devMessage(...args: any) {
	if (dev) console.log(`[%cPF2e Graphics%c %cDEV%c]`, 'color: yellow', '', 'color: #20C20E;', '', ...args)
}

export function log(...args: any) {
	if (dev) console.log(`[%cPF2e Graphics%c]`, 'color: yellow', '', ...args)
}

export function i18n(string: string, format?: any) {
	if (!string.includes('pf2e-graphics')) {
		const test = `pf2e-graphics.${string}`
		if (game.i18n.format(test, format) !== test) string = `pf2e-graphics.${string}`
	}
	return game.i18n.format(string, format)
}

export const findTokenByActor = (actor?: ActorPF2e | null) => canvas.tokens.getDocuments().find(x => x.actor?.id === actor?.id)

export function dedupeStrings(array: string[]) {
	return Array.from(new Set(array))
}
