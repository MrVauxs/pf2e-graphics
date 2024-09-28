import type { JSONData } from './storage/AnimCore';
import { TJSGameSettings, TJSLiveGameSettings } from '#runtime/svelte/store/fvtt/settings';

const storeSettings = new TJSGameSettings('pf2e-graphics');
export type storeSettingsType = typeof storeSettings;

let settings: TJSLiveGameSettings & {
	quality: 0 | 1 | 2 | 3;
	persistent: boolean;
	buttonPosition: 0 | 1 | 2;
	dev: boolean;
	worldAnimations: JSONData;
	suppressWarnings: boolean;
	volume: number;
	delay: number;
	jb2aMode: 'patreon' | 'free';
	history: boolean;
};
export type liveSettings = typeof settings;

const settingsData = [
	{
		namespace: 'pf2e-graphics',
		key: 'worldAnimations',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.worldAnimations.name',
			hint: 'pf2e-graphics.settings.worldAnimations.hint',
			scope: 'world',
			config: false,
			type: Object,
			default: {},
		},
	},
	{
		namespace: 'pf2e-graphics',
		key: 'history',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.history.name',
			hint: 'pf2e-graphics.settings.history.hint',
			scope: 'world',
			config: true,
			type: Boolean,
			default: false,
		},
	},
	{
		namespace: 'pf2e-graphics',
		key: 'quality',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.quality.name',
			hint: 'pf2e-graphics.settings.quality.hint',
			scope: 'client',
			config: true,
			type: Number,
			default: 2,
			choices: {
				0: 'pf2e-graphics.settings.quality.0',
				1: 'pf2e-graphics.settings.quality.1',
				2: 'pf2e-graphics.settings.quality.2',
				3: 'pf2e-graphics.settings.quality.3',
			},
		},
	},
	{
		namespace: 'pf2e-graphics',
		key: 'persistent',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.persistent.name',
			hint: 'pf2e-graphics.settings.persistent.hint',
			scope: 'client',
			config: true,
			type: Boolean,
			default: false,
		},
	},
	{
		namespace: 'pf2e-graphics',
		key: 'volume',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.volume.name',
			hint: 'pf2e-graphics.settings.volume.hint',
			scope: 'client',
			config: true,
			type: Number,
			default: 1,
			range: {
				min: 0,
				step: 0.05,
				max: 2,
			},
		},
	},
	{
		namespace: 'pf2e-graphics',
		key: 'delay',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.delay.name',
			hint: 'pf2e-graphics.settings.delay.hint',
			scope: 'client',
			config: true,
			type: Number,
			default: 0,
			range: {
				min: 0,
				step: 1,
				max: 10,
			},
		},
	},
	{
		namespace: 'pf2e-graphics',
		key: 'buttonPosition',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.buttonPosition.name',
			hint: 'pf2e-graphics.settings.buttonPosition.hint',
			scope: 'client',
			config: true,
			type: Number,
			default: 0,
			choices: {
				0: 'pf2e-graphics.settings.buttonPosition.0',
				1: 'pf2e-graphics.settings.buttonPosition.1',
				2: 'pf2e-graphics.settings.buttonPosition.2',
			},
		},
	},
	{
		namespace: 'pf2e-graphics',
		key: 'dev',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.dev.name',
			hint: 'pf2e-graphics.settings.dev.hint',
			scope: 'client',
			config: true,
			type: Boolean,
			default: false,
		},
	},
] as const;

function devSettings() {
	return [
		{
			namespace: 'pf2e-graphics',
			key: 'suppressWarnings',
			folder: 'PF2e Graphics',
			options: {
				name: 'pf2e-graphics.settings.suppressWarnings.name',
				hint: 'pf2e-graphics.settings.suppressWarnings.hint',
				scope: 'client',
				config: game.settings.get('pf2e-graphics', 'dev') as boolean,
				type: Boolean,
				default: false,
			},
		},
		{
			namespace: 'pf2e-graphics',
			key: 'jb2aMode',
			folder: 'PF2e Graphics',
			options: {
				name: 'pf2e-graphics.settings.jb2aMode.name',
				hint: 'pf2e-graphics.settings.jb2aMode.hint',
				scope: 'client',
				config: game.settings.get('pf2e-graphics', 'dev') as boolean,
				type: String,
				default: 'patreon',
				choices: {
					patreon: 'pf2e-graphics.settings.jb2aMode.patreon',
					free: 'pf2e-graphics.settings.jb2aMode.free',
				},
			},
		},
	] as const;
}

Hooks.once('init', () => {
	storeSettings.registerAll(settingsData, true);
	storeSettings.registerAll(devSettings(), true);

	settings = new TJSLiveGameSettings(storeSettings) as typeof settings;

	window.pf2eGraphics.liveSettings = settings;
	window.pf2eGraphics.storeSettings = storeSettings;
});
