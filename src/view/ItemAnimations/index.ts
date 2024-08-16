import ItemAnimationsApp from './ItemAnimationsApp.ts'

const getItemSheetHeaderButtons = Hooks.on('getItemSheetHeaderButtons', (application: ItemSheetPF2e<any>, buttons: ApplicationHeaderButton[]) => {
	buttons.unshift({
		class: 'pf2e-g',
		icon: 'fas fa-film',
		onclick: (event) => {
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

			if ((event as MouseEvent).shiftKey) application.close()

			new ItemAnimationsApp({
				document: application.item,
			}).render(true, {
				focus: true,
				...position,
			})
		},
		label: 'Animations',
	})
})

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept()
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('getItemSheetHeaderButtons', getItemSheetHeaderButtons)
	})
}
