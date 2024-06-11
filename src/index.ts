import './app.css'
import App from './App.svelte'

Hooks.on("getItemSheetHeaderButtons", (application: ItemSheetPF2e<any>, buttons: ApplicationHeaderButton[]) => {
    buttons.unshift({
        class: "my-button",
        icon: "fas fa-film",
        onclick: () => {
            ui.notifications.info("Hello World");
            // new BasicApplication().render(true, { focus: true })
        },
        label: "Graphics"
    })

    const app = new App({
        target: document.getElementById('app')!,
    })

    console.log(app)
})