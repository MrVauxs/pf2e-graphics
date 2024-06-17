import "./app.css"
import BasicApplication from "./view/BasicApplication"

console.warn("Hello World")
// import App from './App.svelte'

Hooks.on("getItemSheetHeaderButtons", (application: ItemSheetPF2e<any>, buttons: ApplicationHeaderButton[]) => {
	console.log(application)

	buttons.unshift({
		class: "my-button",
		icon: "fas fa-film",
		onclick: () => {
			new BasicApplication().render(true, { focus: true })
			// new BasicApplication().render(true, { focus: true })
		},
		label: "Are you serious?",
	})
})

