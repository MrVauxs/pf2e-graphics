import { i18n } from 'src/utils.ts';
import ItemAnimationsApp from './ItemAnimationsApp.ts';

function spawn(application: ItemSheetPF2e<any>) {
	const position = {
		...application.position,
		top: (application.position.top ?? 0) + (application?.element?.[0]?.firstElementChild as HTMLElement)?.offsetHeight,
	};

	new ItemAnimationsApp({
		document: application.item,
	}).render(true, {
		focus: true,
		...position,
	});
}

const getItemSheetHeaderButtons = Hooks.on('getItemSheetHeaderButtons', (application: ItemSheetPF2e<any>, buttons: ApplicationHeaderButton[]) => {
	if (!(window.pf2eGraphics.liveSettings.buttonPosition === 0 || window.pf2eGraphics.liveSettings.buttonPosition === 2)) return;
	buttons.unshift({
		class: 'pf2e-g',
		icon: 'fas fa-film',
		onclick: (event) => {
			const position = {
				...application.position,
				top: (application.position.top ?? 0) + (application?.element?.[0]?.firstElementChild as HTMLElement)?.offsetHeight,
			};

			if ((event as MouseEvent).shiftKey) application.close();

			new ItemAnimationsApp({
				document: application.item,
			}).render(true, {
				focus: true,
				...position,
			});
		},
		label: window.pf2eGraphics.liveSettings.buttonPosition === 2 ? '' : 'Graphics',
	});
});

const renderItemSheetPF2e = Hooks.on('renderItemSheetPF2e', (application: ItemSheetPF2e<any>, html: JQuery) => {
	if (!(window.pf2eGraphics.liveSettings.buttonPosition === 1)) return;

	const navbar = html[0].getElementsByClassName('tabs')[0];
	const button = `
		<a class="list-row" data-tooltip="pf2e-graphics.modifyItem" role="tab">
			<i class="fa-solid fa-film" style="vertical-align: text-bottom"></i> ${i18n('animations')}
        </a>
		`;

	$(navbar)
		.append($(button)
			.on('click', () => { spawn(application); }));
});

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('getItemSheetHeaderButtons', getItemSheetHeaderButtons);
		Hooks.off('renderItemSheetPF2e', renderItemSheetPF2e);
	});
}
