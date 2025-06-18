<script lang="ts">
	import {LteButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	type Props = {
		xsmall?: boolean | undefined;
		small?: boolean | undefined;
		large?: boolean | undefined;
		disabled?: boolean; // $: noSizeSet = !xsmall && !small && !large
	}

	let {
		    xsmall   = undefined,
		    small    = undefined,
		    large    = undefined,
		    disabled = false
	    }: Props = $props()


</script>

<LteButton
	color="info"
	title={$_("map.tooltips.showOnMap")}
	{xsmall}
	{small}
	{large}
	{disabled}
	on:click
>
	<i class="fas fa-map-marker-alt fa-fw"></i>
</LteButton>
