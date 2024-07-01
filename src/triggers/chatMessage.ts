import type { TriggerTypes } from 'src/storage/AnimCore'
import { devMessage, log } from 'src/utils'

const chatMessageHook = Hooks.on('createChatMessage', (message: ChatMessagePF2e, _options, _id: ChatMessagePF2e['id']) => {
	const rollOptions = message.flags.pf2e.context?.options ?? []
	let trigger = message.flags.pf2e.context?.type as TriggerTypes
	if (!message.token) return

	if (!trigger) {
		if ('appliedDamage' in message.flags.pf2e) {
			trigger = 'damage-taken' as const
		} else {
			log('PF2e Animations | No message type found. Aborting.')
			return
		}
	}

	const missed = message.flags.pf2e.context?.outcome?.includes('ailure') ?? false
	const additionalOptions = { missed }
	// @ts-expect-error - Too lazy to properly define custom modules flags
	const toolbelt = message.flags?.['pf2e-toolbelt']?.targetHelper?.targets?.map(t => fromUuidSync(t)) as (TokenDocumentPF2e | null)[] | undefined

	const targets = trigger === 'saving-throw' ? [message.token] : (toolbelt ?? (message.target?.token ? [message.target?.token] : [...game.user.targets]))

	const deliverable = {
		rollOptions,
		trigger,
		targets,
		source: message.token,
		item: message.item,
		...additionalOptions,
	}
	devMessage('Chat Message Hook', deliverable)
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable)
})

const targetHelper = Hooks.on('updateChatMessage', (message: ChatMessagePF2e, { flags }: { flags: ChatMessageFlagsPF2e }) => {
	if (!flags) return
	if ('pf2e-toolbelt' in flags) {
		// @ts-expect-error - Too lazy to properly define custom modules flags
		for (const targetId of Object.keys(flags['pf2e-toolbelt']?.targetHelper?.saves || {})) {
			// @ts-expect-error - Too lazy to properly define custom modules flags
			const roll = flags['pf2e-toolbelt']?.targetHelper?.saves[targetId]
			const target = canvas.tokens.get(targetId)
			roll.roll = JSON.parse(roll.roll)

			devMessage('Target Helper saving throw update', { roll, target })

			if (!target) return
			if (!message.token) return

			const rollOptions = message.flags.pf2e.context?.options ?? []
			const trigger = roll.roll.options.type
			const additionalOptions = { outcome: roll?.success }

			const deliverable = {
				rollOptions,
				trigger,
				targets: [target],
				source: message.token,
				item: message.item,
				...additionalOptions,
			}

			devMessage('Target Helper Hook', deliverable)
			window.pf2eGraphics.AnimCore.findAndAnimate(deliverable)
		}
	}
})

if (import.meta.hot) {
	// Prevents reloads
	import.meta.hot.accept()
	// Disposes the previous hook
	import.meta.hot.dispose(() => {
		Hooks.off('createChatMessage', chatMessageHook)
		Hooks.off('updateChatMessage', targetHelper)
	})
}
