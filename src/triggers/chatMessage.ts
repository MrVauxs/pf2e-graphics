import type { TriggerTypes } from 'src/storage/AnimCore'
import { devMessage, log } from 'src/utils'

function handleChatMessage(message: ChatMessagePF2e) {
	const rollOptions = message.flags.pf2e.context?.options ?? []
	const trigger = message.flags.pf2e.context?.type as TriggerTypes | undefined
	if (!message.token) return

	if (!trigger) {
		log('No message type found. Aborting.')
		return
	}

	const missed = message.flags.pf2e.context?.outcome?.includes('ailure') ?? false
	const animationOptions = { missed }
	// @ts-expect-error - Too lazy to properly define custom modules flags
	const toolbelt = message.flags?.['pf2e-toolbelt']?.targetHelper?.targets?.map(t => fromUuidSync(t)) as (TokenDocumentPF2e | null)[] | undefined

	// If its a save or damage taken, use message.token
	// Otherwise grab whatever targets are available
	const targets = trigger === 'saving-throw' || trigger === 'damage-taken'
		? [message.token]
		: (toolbelt ?? (
				message.target?.token
					? [message.target?.token]
					: Array.from((message.author as UserPF2e).targets)
			))

	if (targets.length === 0) return log('No targets founds in message, aborting.')

	// If there is an origin, get the actors token.
	// Otherwise just ~~kill~~ use the messenger.
	const source = message.flags.pf2e.origin?.actor
		? (fromUuidSync(message.flags.pf2e.origin?.actor) as ActorPF2e).getActiveTokens()[0]
		: message.token

	const deliverable = {
		rollOptions: rollOptions.concat([`outcome:${message.flags.pf2e.context?.outcome || 'none'}`]),
		trigger,
		targets,
		source,
		item: message.item,
		animationOptions,
	}
	devMessage('Chat Message Hook', deliverable)
	window.pf2eGraphics.AnimCore.findAndAnimate(deliverable)
}

const diceSoNiceHook = Hooks.on('diceSoNiceRollComplete', (id: string) => {
	if (!game.settings.get('dice-so-nice', 'immediatelyDisplayChatMessages')) {
		const message = game.messages.get(id)
		if (message) handleChatMessage(message)
	}
})

const chatMessageHook = Hooks.on('createChatMessage', (msg: ChatMessagePF2e) => {
	if (
		game.modules.get('dice-so-nice')?.active
		&& !game.settings.get('dice-so-nice', 'immediatelyDisplayChatMessages')
	) { return }
	handleChatMessage(msg)
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

			if (!target) return log('The target token no longer exists?? Aborting.')
			if (!message.token) return log('The source token no longer exists?? Aborting.')

			const rollOptions = message.flags.pf2e.context?.options ?? []
			const trigger = roll.roll.options.type
			const animationOptions = { missed: roll?.success }

			const deliverable = {
				rollOptions,
				trigger,
				targets: [target],
				source: message.token,
				item: message.item,
				animationOptions,
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
		Hooks.off('diceSoNiceHook', diceSoNiceHook)
		Hooks.off('createChatMessage', chatMessageHook)
		Hooks.off('updateChatMessage', targetHelper)
	})
}
