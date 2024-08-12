import ActorAnimationsApp from './ActorAnimationsApp'

function spawn(application: CharacterSheetPF2e) {
	const positionSetting = window.pf2eGraphics.liveSettings.windowPosition
	let position = {}
	const bounds = application.element[0].getBoundingClientRect()

	switch (positionSetting) {
		case 'sidebar':
			position = {
				...application.position,
				left: bounds.right,
				width: Number(application.position.width) / 2,
			}
			break
		case 'onTop':
			position = application.position
			break
	}

	new ActorAnimationsApp({
		data: { actor: application.actor },
	}).render(true, {
		focus: true,
		...position,
	})
}

Hooks.on('getActorSheetHeaderButtons', (application: CharacterSheetPF2e, buttons: ApplicationHeaderButton[]) => {
	if (!(window.pf2eGraphics.liveSettings.buttonPosition === 0) && application.actor.isOfType('character')) return
	buttons.unshift({
		class: 'my-button',
		icon: 'fas fa-film',
		onclick: () => { spawn(application) },
		label: 'Graphics',
	})
})

Hooks.on('renderCharacterSheetPF2e', (application: CharacterSheetPF2e, html: JQuery) => {
	if (!(window.pf2eGraphics.liveSettings.buttonPosition === 1) && !application.actor.isOfType('character')) return

	const navbar = html[0].getElementsByClassName('sheet-navigation')[0]

	const button = `
		<a class="item" data-tooltip="pf2e-graphics.modifyActor" role="tab">
            <i class="fa-solid fa-film"></i>
        </a>
		`

	$(navbar)
		.append($(button)
			.on('click', () => { spawn(application) }))
})

Hooks.on('renderCharacterSheetPF2e', (application: CharacterSheetPF2e, html: JQuery) => {
	const flag = application.actor.flags['pf2e-graphics']?.tokenImageID
	const display = application.actor.flags['pf2e-graphics']?.displayFeat
	if (!flag || window.pf2eGraphics.liveSettings.dev || display) return

	html[0].querySelectorAll(`[data-item-id="${flag}"]`)[0]?.remove()
})
