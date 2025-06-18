<script lang="ts">
	import {updatePageFiltersPreference} from "$lib/stores/preferences.js"
	import {updateQuerystringAsync} from "$lib/helpers/router-helpers.js"
	import {_} from "svelte-i18n"
	import {LteButton} from "@keenmate/svelte-adminlte"
	import {createEventDispatcher} from "svelte"

	const dispatch = createEventDispatcher()

	type Props = {
		pageFiltersKey: string;
		filtersToKeep?: object;
	}

	let {pageFiltersKey, filtersToKeep = undefined}: Props = $props()

	function onClick() {
		updatePageFiltersPreference(pageFiltersKey, null)

		updateQuerystringAsync(filtersToKeep || {})

		dispatch("click")
	}
</script>

<LteButton
	color="secondary"
	title={$_("common.tooltips.clearFilters")}
	small
	on:click={onClick}
>
	<i class="fas fa-times fa-fw"></i>
</LteButton>
