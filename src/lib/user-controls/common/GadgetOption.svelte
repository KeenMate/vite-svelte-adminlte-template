<script lang="ts">

	type Props = {
		checked?: boolean;
		children?: import("svelte").Snippet;
	}

	let {checked = false, children}: Props = $props()
</script>

<span class="gadget-option">
	<i
		class="far"
		class:fa-check-square={checked}
		class:fa-square={!checked}
	></i>

	{@render children?.()}
</span>
