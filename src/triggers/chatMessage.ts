import type { TriggerTypes } from 'src/storage/AnimCore'
import { devMessage, log } from 'src/utils'

let chatMessageHook = -1904

function chatMessage(message: ChatMessagePF2e | undefined, _options: object, _id: ChatMessagePF2e['id']) {
	if (!message) return
	const rollOptions = message.flags.pf2e.context?.options ?? []
	let trigger: TriggerTypes | undefined = message.flags.pf2e.context?.type
	if (!message.token) return

	if (!trigger) {
		if ('appliedDamage' in message.flags.pf2e) {
			trigger = 'damage-taken' as const
		} else {
			log('No message type found. Aborting.')
			return
		}
	}

	const missed = message.flags.pf2e.context?.outcome?.includes('ailure') ?? false
	const additionalOptions = { missed }
	// @ts-expect-error - Too lazy to properly define custom modules flags
	const toolbelt = message.flags?.['pf2e-toolbelt']?.targetHelper?.targets?.map(t => fromUuidSync(t)) as (TokenDocumentPF2e | null)[] | undefined

	const targets = trigger === 'saving-throw' ? [message.token] : (toolbelt ?? (message.target?.token ? [message.target?.token] : [...game.user.targets]))

	if (targets.length === 0) return log('No targets founds in message, aborting.')

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
}

function checkDiceSoNice() {
	return game.modules.get('dice-so-nice')?.active
		&& !game.settings.get('dice-so-nice', 'immediatelyDisplayChatMessages')
}

Hooks.on('ready', () => {
	chatMessageHook = checkDiceSoNice()
		? Hooks.on('diceSoNiceRollComplete', (id: string) => chatMessage(game.messages.get(id), {}, id))
		: Hooks.on('createChatMessage', chatMessage)
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
		Hooks.off('diceSoNiceRollComplete', chatMessageHook)
		Hooks.off('createChatMessage', chatMessageHook)
		Hooks.off('updateChatMessage', targetHelper)
	})
}
