<script lang="ts">
	import {LteButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	function onClick() {
		window.history.back()
	}
</script>

<LteButton
	color="info"
	title={$_("common.tooltips.navigateBackButton")}
	small
	on:click={onClick}
>
	<i class="fas fa-arrow-left fa-fw"></i>
</LteButton>
