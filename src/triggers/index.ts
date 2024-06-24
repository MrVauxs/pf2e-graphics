import { devMessage, nonNullable } from 'src/utils.ts'
import './chatMessage.ts'
import type { AnimationDataObject } from 'src/storage/AnimCore.ts'
import type { TokenOrDoc } from 'src/extensions'

interface Params {
	rollOptions: string[]
	type: AnimationDataObject['type']
	additionalOptions: any
	targets: (TokenOrDoc | null | undefined)[]
	source: TokenOrDoc
	item?: ItemPF2e | null
}

export let findAndAnimate = function findAndAnimate({ rollOptions, type, additionalOptions, targets, source, item }: Params) {
	const animationTree = window.pf2eGraphics.AnimCore.getMatchingAnimationTrees(rollOptions, item, game.userId)
	const sequence = new Sequence({ inModuleName: 'pf2e-graphics' })

	devMessage('Animation Tree', animationTree, { rollOptions, type, additionalOptions, targets, source })

	for (const branch of Object.keys(animationTree)) {
		const matchingAnimations = animationTree[branch]
		let validAnimations = matchingAnimations.filter(a => a.type === type).filter(animation => game.pf2e.Predicate.test(animation.predicate, rollOptions))

		if (validAnimations.filter(a => !a.default).length > 0)
			validAnimations = validAnimations.filter(a => !a.default)

		validAnimations.forEach((animation) => {
			window.pf2eGraphics.AnimCore.animate(animation.preset, {
				sequence,
				file: animation.file,
				targets: targets.filter(nonNullable),
				source,
				options: foundry.utils.mergeObject(additionalOptions, animation.options),
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
