<script lang="ts">
	import {updateQuerystringPartialAsync} from "@keenmate/js-common-helpers/helpers/router.js"
	import {_} from "svelte-i18n"
	import {LteButton} from "@keenmate/svelte-adminlte"

	let {filtersVisible} = $props()
</script>

<LteButton
	class="toggle-advanced-filters"
	color="link"
	on:click={() => updateQuerystringPartialAsync({filtersVisible: (!filtersVisible).toString()})}
>
	{#if filtersVisible}
		{$_("common.labels.hideFilters")}
	{:else}
		{$_("common.labels.showFilters")}
	{/if}
</LteButton>
<!--<a-->
<!--	href="javascript:void(0)"-->
<!--	on:click={() => updateQuerystringPartialAsync({filtersVisible: !filtersVisible})}-->
<!--&gt;-->
<!--	{#if filtersVisible}-->
<!--		{$_("common.labels.hideFilters")}-->
<!--	{:else}-->
<!--		{$_("common.labels.showFilters")}-->
<!--	{/if}-->
<!--</a>-->

<style lang="scss">
	:global {
		button.toggle-advanced-filters {
			// to prevent button from jumping
			//width: 7.5rem;
			text-align: right;
		}
	}
</style>
