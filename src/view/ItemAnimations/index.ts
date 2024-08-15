import ItemAnimationsApp from './ItemAnimationsApp'

Hooks.on('getItemSheetHeaderButtons', (application: ItemSheetPF2e<any>, buttons: ApplicationHeaderButton[]) => {
	buttons.unshift({
		class: 'pf2e-g',
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
					position = {
						...application.position,
						top: (application.position.top ?? 0) + (application?.element?.[0]?.firstElementChild as HTMLElement)?.offsetHeight,
					}
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
