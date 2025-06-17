<script lang="ts">
	export let color = "lightgray"
	export let title = ""

	$: style = `
		--background-color: ${color}
	`
</script>

<span class="ball" {style} {title}>
	<span />
</span>

<style lang="scss">
	.ball {
		--size: .5em;

		display: inline-block;
		padding: 0 .25em;

		& > span {
			display: inline-block;
			border-radius: 1em;
			background-color: var(--background-color, lightgray);
			width: var(--size);
			height: var(--size);
		}
	}
</style>
