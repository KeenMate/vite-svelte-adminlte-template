<script lang="ts">
	type Props = {
		children?: import("svelte").Snippet;
		[key: string]: any
	}

	let {children = undefined, ...rest}: Props = $props()
</script>

<div spellcheck="false" {...rest}>
	{@render children?.()}
</div>
