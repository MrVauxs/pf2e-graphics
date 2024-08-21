<script lang='ts'>
	export let img = '';
	export let transform = 1;

	// This file is basically to not have Svelte re-render the image every time the window changes.
	let thumb = '';
	$: ImageHelper
		.createThumbnail(img, { width: 200, height: 200 })
		.then((v) => { thumb = v.thumb; });

	function popout() {
		new ImagePopout(img).render(true);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	tabindex='-1'
	role='button'
	class='border-solid border cursor-pointer h-12 hover:scale-[2] transition-transform'
	on:click={popout}
>
	<img
		src={thumb}
		alt='Token'
		class='border-none p-0 m-0 aspect-square max-h-full max-w-none'
		style:transform='scale({transform})'
	/>
</div>
