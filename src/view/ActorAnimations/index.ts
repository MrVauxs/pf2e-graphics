import { settings } from 'src/settings'
import ActorAnimationsApp from './ActorAnimationsApp'

let app: null | ActorAnimationsApp = null

function spawn(application: CharacterSheetPF2e) {
	const positionSetting = settings.windowPosition
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

	if (app) {
		app.render(true, { focus: true })
	} else {
		app = new ActorAnimationsApp({
			data: { actor: application.actor },
			id: `pf2e-graphics-modify-item-${application.actor.id}`,
		}).render(true, {
			focus: true,
			...position,
		})
	}
}

Hooks.on('getActorSheetHeaderButtons', (application: CharacterSheetPF2e, buttons: ApplicationHeaderButton[]) => {
	if (!(settings.buttonPosition === 0)) return
	buttons.unshift({
		class: 'my-button',
		icon: 'fas fa-film',
		onclick: () => { spawn(application) },
		label: 'Graphics',
	})
})

Hooks.on('renderCharacterSheetPF2e', (application: CharacterSheetPF2e, html: JQuery) => {
	if (!(settings.buttonPosition === 1)) return

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
	if (!flag || settings.dev || display) return

	html[0].querySelectorAll(`[data-item-id="${flag}"]`)[0]?.remove()
})
