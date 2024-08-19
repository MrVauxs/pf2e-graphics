<div class='separator'><slot /></div>

<style>
	.separator {
		display: flex;
		align-items: center;
		text-align: center;
	}

	.separator::before,
	.separator::after {
		content: '';
		flex: 1;
		margin-right: .25em;
		margin-left: .25em;
		border: none;
		border-top: 1px solid var(--color-border-light-primary);
		border-bottom: 1px solid var(--color-border-light-highlight);
		box-shadow: 0 2px 2px gray;
	}
</style>
