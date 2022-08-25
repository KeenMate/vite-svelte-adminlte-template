<script>
	import {LteButton} from "@keenmate/svelte-adminlte"

	export let action
	export let enabledWhenLoading = false

	export let iconClass

	let loading = false

	async function onClick(ev) {
		try {
			loading = true
			await action()
		} finally {
			loading = false
		}
	}
</script>

<LteButton {...$$restProps} disabled={enabledWhenLoading ? false : loading} on:click={onClick}>
	{#if loading}
		<i class="fas fa-circle-notch fa-spin fa-fw" style="--fa-animation-duration: 1s"></i>
	{:else if iconClass}
		<i class="{iconClass} fa-fw"></i>
	{/if}

	<slot />
</LteButton>
