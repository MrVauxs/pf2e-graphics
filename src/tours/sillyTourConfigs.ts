import type { TourConfigOptions } from '.';
import type { TourConfig } from '../extensions';

/**
 * An array of less-serious `TourConfig`s that define the tours that *PF2e Graphics* adds.
 */
export function generateSillyTourConfigs(_options: TourConfigOptions): TourConfig[] {
	return [
		// {
		// 	namespace: 'pf2e-graphics',
		// 	id: 'shishkin',
		// 	title: '🤹 Ivan Shishkin',
		// 	description:
		// 		'A (very) brief gallery of landscape paintings by Ivan Shishkin (1832–1898). Only very tangentially related to <i>PF2e Graphics</i>, but interesting nonetheless!',
		// 	display: true,
		// 	steps: [
		// 		{
		// 			id: '1',
		// 			title: 'Lumbering (1867)',
		// 			content:
		// 				'<img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/%D0%A0%D1%83%D0%B1%D0%BA%D0%B0_%D0%BB%D0%B5%D1%81%D0%B0_%28%D0%A8%D0%B8%D1%88%D0%BA%D0%B8%D0%BD%29.jpg">',
		// 		},
		// 	],
		// },
		// {
		// 	namespace: 'pf2e-graphics',
		// 	id: 'megapodes',
		// 	title: '🤹 Megapodes',
		// 	description:
		// 		'A (very) brief lecture on the megapodes, also known as the incubating or mound-building birds. Only very tangentially related to <i>PF2e Graphics</i>, but interesting nonetheless!',
		// 	display: true,
		// 	steps: [
		// 		{
		// 			id: '1',
		// 			title: 'Megapodiidae',
		// 			content: 'Megapodes are really cool, actually. :)',
		// 		},
		// 	],
		// },
		// {
		// 	namespace: 'pf2e-graphics',
		// 	id: 'zhuangzi',
		// 	title: '🤹 Reading Rubbish',
		// 	description:
		// 		'A (very) brief dialogue between Duke Huan and Wheelwright Pien, two characters found in the <i>Zhuangzi</i>. Only very tangentially related to <i>PF2e Graphics</i>, but interesting nonetheless!',
		// 	display: true,
		// 	steps: [
		// 		{
		// 			id: '1',
		// 			title: 'Act One',
		// 			content: 'Duke Huan was sitting up in his hall reading a book.',
		// 		},
		// 	],
		// },
	] as const;
}
