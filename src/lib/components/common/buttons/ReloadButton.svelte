<script lang="ts">
	import {LteButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	type Props = {
		xsmall?: boolean;
		small?: boolean;
		large?: boolean;
	}

	let {xsmall = false, small = false, large = false}: Props = $props()

	let noSizeSet = $derived(!xsmall && !small && !large)
</script>

<LteButton
	color="info"
	title={$_("common.buttons.refresh")}
	xsmall={xsmall || noSizeSet}
	{small}
	{large}
	on:click
>
	<i class="fas fa-sync fa-fw"></i>
</LteButton>
