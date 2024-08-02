<script lang='ts'>
	export let img = ''
	export let transform = ''

	// This file is basically to not have Svelte re-render the image every time the window changes.
	let thumb = ''
	$: ImageHelper
		.createThumbnail(img, { width: 50, height: 50 })
		.then((v) => { thumb = v.thumb })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<img
	src={thumb}
	alt='Token'
	class='size-8 border-0 cursor-pointer'
	style:transform={transform}
	on:click={() => new ImagePopout(img).render(true)}
/>
