/* eslint-disable no-console */
export class ErrorMsg extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'PF2e Graphics Error'

		ui.notifications.error(`PF2e Graphics | ${message}`)
	}
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined
}

export const dev = import.meta.env.DEV

export function devMessage(...args: any) {
	if (dev) console.log(`[%cPF2e Graphics%c %cDEV%c]`, 'color: yellow', '', 'color: #20C20E;', '', ...args)
}

export function log(...args: any) {
	if (dev) console.log(`[%cPF2e Graphics%c]`, 'color: yellow', '', ...args)
}

export function i18n(string: string, format?: any) {
	if (!string.includes('pf2e-graphics')) string = `pf2e-graphics.${string}`
	return game.i18n.format(string, format)
}
