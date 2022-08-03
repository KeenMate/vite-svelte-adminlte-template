<script>
	import {get} from "svelte/store"
	import {querystring} from "svelte-spa-router"
	import {
		Label,
		Pagination
	} from "svelte-adminlte"
	import {parse} from "qs"
	import SvelteSelect from "svelte-select"
	import {_} from "svelte-i18n"
	import {updateQuerystring} from "../../../helpers/router-helpers"
	import {PageSizes} from "../../../constants/pagination"
	// import {Multiselect} from "svelte-multiselect"

	export let pagination
	export let pages
	export let rowsCount

	$: pageSize = {
		value: pagination.pageSize || 5,
		label: pagination.pageSize || 5
	}

	function updateQuerystringPartial(partial) {
		updateQuerystring({
			...parse(get(querystring)),
			...partial
		}, true)
	}

	function onUpdatePage({detail: page}) {
		updateQuerystringPartial({
			page: page
		})
	}

	function updatePageSize({detail: pageSize}) {
		updateQuerystringPartial({
			pageSize: pageSize?.value,
			page: 1
		})
	}
</script>

<div class="pagination-footer d-flex justify-content-end align-items-center px-1 mt-2 flex-wrap">
	{#if rowsCount}
		<div>
			<Label class="mb-0">
				{$_("common.labels.rowsCount")}
			</Label>
			{rowsCount}
		</div>
	{/if}
	<div class="pagination d-flex justify-content-end align-items-center">
		<Label inputId="page-size" class="page-size-label">
			{$_("common.labels.pageSize")}
		</Label>

		<div class="page-size-select mr-2">
			<!--<Multiselect-->
			<!--	id="page-size"-->
			<!--	options={PageSizes}-->
			<!--	value={pageSize}-->
			<!--	trackBy="value"-->
			<!--	label="label"-->
			<!--	placeholer={$_("common.placeholders.pageSize")}-->
			<!--	overflow-->
			<!--	on:input={updatePageSize}-->
			<!--&gt;-->
			<!--	<svelte:fragment slot="option" let:option>-->
			<!--		{option.label}-->
			<!--	</svelte:fragment>-->
			<!--</Multiselect>-->

			<SvelteSelect
				id="page-size"
				value={pageSize}
				items={PageSizes}
				placeholder={$_("common.placeholders.pageSize")}
				on:select={updatePageSize}
				on:clear={() => updatePageSize({ detail: null })}
			/>
		</div>
	</div>

	<div class="d-flex flex-column justify-content-end">
		<Pagination
			page={pagination.page || 1}
			pages={pages}
			class="pagination-sm mb-0"
			on:updatePage={onUpdatePage} />
	</div>
</div>

<style lang="sass">
	.pagination-footer
		gap: .5rem

	:global
		.pagination
			.page-size-label
				margin: 0 1rem

			.page-size-select
				min-width: 5rem
</style>
