import ItemAnimationsApp from "./ItemAnimationsApp"

Hooks.on("getItemSheetHeaderButtons", (application: ItemSheetPF2e<any>, buttons: ApplicationHeaderButton[]) => {
    buttons.unshift({
        class: "my-button",
        icon: "fas fa-film",
        onclick: () => {
            const positionSetting = game.settings.get("pf2e-graphics", "windowPosition")
            let position = {}
            let bounds = application.element[0].getBoundingClientRect()

            switch (positionSetting) {
                case "sidebar":
                    position = {
                        ...application.position,
                        left: bounds.right,
                        width: Number(application.position.width) / 2,
                    }
                    break
                case "onTop":
                    position = application.position
                    break
            }

            new ItemAnimationsApp({ data: { item: application.item }, ...position }).render(true, { focus: true })
        },
        label: "Animations",
    })
})