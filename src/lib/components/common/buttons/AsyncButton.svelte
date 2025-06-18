<script lang="ts">
	import {LteButton} from "@keenmate/svelte-adminlte"


	type Props = {
		action: any;
		enabledWhenLoading?: boolean;
		iconClass: any;
		children?: import("svelte").Snippet;
		[key: string]: any
	}

	let {
		    action,
		    enabledWhenLoading = false,
		    iconClass,
		    children           = undefined,
		    ...rest
	    }: Props = $props()

	let loading = $state()

	let disabled = $derived(rest.disabled
	|| enabledWhenLoading ? false : loading)

	async function onClick(ev) {
		try {
			loading = true
			await action()
		} finally {
			loading = false
		}
	}
</script>

<LteButton {...rest} {disabled} on:click={onClick}>
	{#if loading}
		<i class="fas fa-circle-notch fa-spin fa-fw" style="--fa-animation-duration: 1s"></i>
	{:else if iconClass}
		<i class="{iconClass} fa-fw"></i>
	{/if}

	{@render children?.()}
</LteButton>
