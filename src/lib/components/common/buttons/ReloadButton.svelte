<script>
	import {LteButton} from "svelte-adminlte"
	import { _ } from "svelte-i18n";
</script>

<LteButton
	color="info"
	small
	on:click
	title={$_("common.buttons.refresh")}
>
	<i class="fas fa-sync fa-fw"></i>
</LteButton>
