<script lang="ts">
	import {LteButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	export let xsmall: boolean | undefined = undefined
	export let small: boolean | undefined = undefined
	export let large: boolean | undefined = undefined
	export let disabled = false

	// $: noSizeSet = !xsmall && !small && !large
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
	<i class="fas fa-map-marker-alt fa-fw" />
</LteButton>
