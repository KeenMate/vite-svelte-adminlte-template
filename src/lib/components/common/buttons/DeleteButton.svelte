<script>
	import {LteButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	export let xsmall = false
	export let small = false
	export let large = false

	$: noSizeSet = !xsmall && !small && !large
</script>

<LteButton
	color="danger"
	title={$_("common.buttons.delete")}
	xsmall={xsmall || noSizeSet}
	{small}
	{large}
	on:click
>
	<i class="fas fa-trash fa-fw" />
	<slot />
</LteButton>
