import type { JSONData } from './storage/AnimCore';
import { TJSGameSettings, TJSLiveGameSettings } from '#runtime/svelte/store/fvtt/settings';

const storeSettings = new TJSGameSettings('pf2e-graphics');
export type storeSettingsType = typeof storeSettings;

let settings: TJSLiveGameSettings & {
	windowPosition: 'sidebar' | 'onTop';
	quality: 0 | 1 | 2 | 3;
	buttonPosition: 0 | 1;
	dev: boolean;
	worldAnimations: JSONData;
	suppressWarnings: boolean;
	volume: number;
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
		key: 'windowPosition',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.windowPosition.name',
			hint: 'pf2e-graphics.settings.windowPosition.hint',
			scope: 'client',
			config: true,
			type: String,
			default: 'sidebar',
			choices: {
				sidebar: 'pf2e-graphics.settings.windowPosition.sidebar',
				onTop: 'pf2e-graphics.settings.windowPosition.onTop',
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
			},
		},
	},
	{
		namespace: 'pf2e-graphics',
		key: 'suppressWarnings',
		folder: 'PF2e Graphics',
		options: {
			name: 'pf2e-graphics.settings.suppressWarnings.name',
			hint: 'pf2e-graphics.settings.suppressWarnings.hint',
			scope: 'client',
			config: true,
			type: Boolean,
			default: false,
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

Hooks.once('init', () => {
	storeSettings.registerAll(settingsData, true);

	settings = new TJSLiveGameSettings(storeSettings) as typeof settings;

	window.pf2eGraphics.liveSettings = settings;
	window.pf2eGraphics.storeSettings = storeSettings;
});
