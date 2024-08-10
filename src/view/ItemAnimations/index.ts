import { settings } from 'src/settings'
import ItemAnimationsApp from './ItemAnimationsApp'

let app: null | ItemAnimationsApp = null

Hooks.on('getItemSheetHeaderButtons', (application: ItemSheetPF2e<any>, buttons: ApplicationHeaderButton[]) => {
	buttons.unshift({
		class: 'my-button',
		icon: 'fas fa-film',
		onclick: () => {
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
				app = new ItemAnimationsApp({
					data: { item: application.item },
					id: `pf2e-graphics-modify-item-${application.item.id}`,
				}).render(true, {
					focus: true,
					...position,
				})
			}
		},
		label: 'Animations',
	})
})
