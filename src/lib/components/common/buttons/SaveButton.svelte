<script lang="ts">
	import {LteButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	export let type = "button"
	export let xsmall = false
	export let small = false
	export let large = false

	$: noSizeSet = !xsmall && !small && !large
</script>

<LteButton
	color="primary"
	{type}
	title={$_("common.tooltips.save")}
	{xsmall}
	small={small || noSizeSet}
	{large}
	on:click
>
	<i class="fas fa-save fa-fw" />
</LteButton>
