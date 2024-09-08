import { i18n } from 'src/utils';
import ActorAnimationsApp from './ActorAnimationsApp';

function spawn(application: CharacterSheetPF2e) {
	const position = {
		...application.position,
		top: (application.position.top ?? 0) + (application?.element?.[0]?.firstElementChild as HTMLElement)?.offsetHeight,
	};

	new ActorAnimationsApp({
		document: application.actor,
	}).render(true, {
		focus: true,
		...position,
	});
}

const getActorSheetHeaderButtons = Hooks.on('getActorSheetHeaderButtons', (application: CharacterSheetPF2e, buttons: ApplicationHeaderButton[]) => {
	if (!(window.pf2eGraphics.liveSettings.buttonPosition === 0) && application.actor.isOfType(...['npc', 'character'])) return;
	buttons.unshift({
		class: 'pf2e-g',
		icon: 'fas fa-film',
		onclick: () => { spawn(application); },
		label: 'Graphics',
	});
});

const renderCreatureSheetPF2e = Hooks.on('renderCreatureSheetPF2e', (application: CharacterSheetPF2e, html: JQuery) => {
	if (!(window.pf2eGraphics.liveSettings.buttonPosition === 1) || !application.actor.isOfType(...['npc', 'character'])) return;

	const actor = html[0].getElementsByClassName('sheet-navigation')[0];
	const npc = html[0].getElementsByClassName('sheet-tabs')[0];

	if (actor) {
		const button = `
		<a class="item" data-tooltip="pf2e-graphics.modifyActor" role="tab">
            <i class="fa-solid fa-film"></i>
        </a>
		`;

		$(actor)
			.append($(button)
				.on('click', () => { spawn(application); }));
	} else if (npc) {
		const button = `
		<a class="item" data-tooltip="pf2e-graphics.modifyActor" role="tab">
            <i class="fa-solid fa-film"></i> ${i18n('animations')}
        </a>
		`;

		$(npc)
			.append($(button)
				.on('click', () => { spawn(application); }));
	}
});

// Remove Token Image Feat
const renderActorSheetPF2e = Hooks.on('renderActorSheetPF2e', (application: CharacterSheetPF2e, html: JQuery) => {
	const flag = application.actor.flags['pf2e-graphics']?.tokenImageID;
	const display = application.actor.flags['pf2e-graphics']?.displayFeat;
	if (!flag || window.pf2eGraphics.liveSettings.dev || display) return;

	html[0].querySelectorAll(`[data-item-id="${flag}"]`)[0]?.remove();
});

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept();
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('getActorSheetHeaderButtons', getActorSheetHeaderButtons);
		Hooks.off('renderCreatureSheetPF2e', renderCreatureSheetPF2e);
		Hooks.off('renderActorSheetPF2e', renderActorSheetPF2e);
	});
}
