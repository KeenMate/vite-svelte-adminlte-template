<script lang="ts">
	import {LteButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
</script>

<LteButton
	color="secondary"
	title={$_("common.tooltips.closeCardButton")}
	small
	on:click
>
	<i class="fas fa-times fa-fw" />
</LteButton>
