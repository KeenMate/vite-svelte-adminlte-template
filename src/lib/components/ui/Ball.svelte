<script lang="ts">
	type Props = {
		color?: string;
		title?: string;
	}

	let {color = "lightgray", title = ""}: Props = $props()

	let style = $derived(`
		--background-color: ${color}
	`)
</script>

<span class="ball" {style} {title}>
	<span></span>
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
