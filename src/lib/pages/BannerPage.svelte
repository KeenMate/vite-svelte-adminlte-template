<script lang="ts">
	type Props = {
		children?: import("svelte").Snippet;
	}

	let {children}: Props = $props()
</script>

<div class="full-height d-flex flex-column gap-2 justify-content-center align-items-center">
	{@render children?.()}
</div>
