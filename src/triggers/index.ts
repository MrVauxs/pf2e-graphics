import { devMessage } from 'src/utils.ts'
import './chatMessage.ts'
import './template.ts'
import type { AnimationDataObject } from 'src/storage/AnimCore.ts'
import type { PresetIndex, PresetKeys } from '../storage/presets'

type Params<T extends PresetKeys> = {
	rollOptions: string[]
	type: AnimationDataObject['type']
	additionalOptions: any
	item?: ItemPF2e | null
} & Omit<PresetIndex[T], 'file' | 'sequence'>

export let findAndAnimate = function findAndAnimate<T extends PresetKeys>({ type, item, rollOptions, additionalOptions, ...other }: Params<T>) {
	const animationTree = window.pf2eGraphics.AnimCore.getMatchingAnimationTrees(rollOptions, item, game.userId)
	const sequence = new Sequence({ inModuleName: 'pf2e-graphics' })

	devMessage('Animation Tree', animationTree, { rollOptions, type, additionalOptions, ...other })

	for (const branch of Object.keys(animationTree)) {
		const matchingAnimations = animationTree[branch]
		let validAnimations = matchingAnimations.filter(a => a.type === type).filter(animation => game.pf2e.Predicate.test(animation.predicate, rollOptions))

		if (validAnimations.filter(a => !a.default).length > 0)
			validAnimations = validAnimations.filter(a => !a.default)

		validAnimations.forEach((animation) => {
			window.pf2eGraphics.AnimCore.animate(animation.preset, {
				sequence,
				file: animation.file,
				options: foundry.utils.mergeObject(additionalOptions, animation.options),
				...other,
			})
		})

		sequence.play()
	}
}

if (import.meta.hot) {
	import.meta.hot.accept((newModule) => {
		if (newModule) {
			findAndAnimate = newModule?.findAndAnimate
			ui.notifications.info('findAndAnimate updated!')
		}
	})
}
