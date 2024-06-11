import './app.css'
// import App from './App.svelte'

Hooks.on('getItemSheetHeaderButtons', (application: ItemSheetPF2e<any>, buttons: ApplicationHeaderButton[]) => {
	console.log(application)

	buttons.unshift({
		class: 'my-button',
		icon: 'fas fa-film',
		onclick: () => {
			ui.notifications.info('Hello World')
			// new BasicApplication().render(true, { focus: true })
		},
		label: 'Are you serious?',
	})
})
