import ItemAnimationsApp from './ItemAnimationsApp'

Hooks.on('getItemSheetHeaderButtons', (application: ItemSheetPF2e<any>, buttons: ApplicationHeaderButton[]) => {
	buttons.unshift({
		class: 'my-button',
		icon: 'fas fa-film',
		onclick: () => {
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

			new ItemAnimationsApp({
				data: { item: application.item },
			}).render(true, {
				focus: true,
				...position,
			})
		},
		label: 'Animations',
	})
})
