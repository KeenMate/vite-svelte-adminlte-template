<script lang="ts">
	import {LteButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	type Props = {
		type?: string;
		xsmall?: boolean;
		small?: boolean;
		large?: boolean;
	}

	let {
		    type   = "button",
		    xsmall = false,
		    small  = false,
		    large  = false
	    }: Props = $props()

	let noSizeSet = $derived(!xsmall && !small && !large)
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
	<i class="fas fa-save fa-fw"></i>
</LteButton>
