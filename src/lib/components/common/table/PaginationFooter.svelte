<script lang="ts">
	import {createEventDispatcher} from "svelte"
	import {InputGroup, Label, Pagination} from "@keenmate/svelte-adminlte"
	import SvelteSelect from "svelte-select"
	import {_} from "svelte-i18n"
	import {updateQuerystringPartialAsync} from "@keenmate/js-common-helpers/helpers/router.js"
	import {DefaultPageSize, PageSizes} from "$lib/constants/pagination.js"
	import type {anyObject} from "@keenmate/js-common-helpers/types/helpers.js"
	import type {PaginationType} from "$lib/types/index.js"

	const dispatch = createEventDispatcher()

	export let pagination: PaginationType
	export let pages: number | null
	export let rowsCount: number | null = null
	export let disablePageSize = false
	export let updatePagination = updateFiltersPartial
	export let inMemory = false
	export let queryPrefix = ""

	export let pageSizes = PageSizes

	$: pageSize = {
		value: pagination.pageSize || DefaultPageSize,
		label: pagination.pageSize || DefaultPageSize
	}

	function onUpdatePage({detail: page}: {detail: number}) {
		if (inMemory) {
			dispatch("pageChanged", page)
		} else {
			const pagination = createPagination(page)
			updatePagination(pagination)
		}
	}

	function updatePageSize({detail: pageSize}: {detail: anyObject | null}) {
		if (inMemory) {
			dispatch("pageSizeChanged", pageSize?.value)
		} else {
			const pagination = createPagination(1, pageSize?.value)
			updatePagination(pagination)
		}
	}

	function createPagination(page?: number | null, pageSize?: number | null): object {
		const pagination = {} as any
		if (page !== undefined) {
			pagination[queryPrefix ? `${queryPrefix}page` : "page"] = page
		}
		if (pageSize !== undefined) {
			pagination[queryPrefix ? `${queryPrefix}pageSize` : "pageSize"] = pageSize
		}

		return pagination
	}

	function updateFiltersPartial(partial: object) {
		updateQuerystringPartialAsync(partial as anyObject, true)
	}
</script>

<div class="pagination-footer d-flex justify-content-end align-items-center gap-4 flex-wrap mb-2">
	<slot></slot>

	{#if rowsCount || $$slots.rowsCount}
		<div class="rows-count">
			<slot name="rowsCount">
				<Label class="mb-0">
					{$_("common.labels.rowsCount")}
				</Label>
				{rowsCount}
			</slot>
		</div>
	{/if}

	<div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
		{#if !disablePageSize}
			<div class="pagination d-flex justify-content-end gap-4 align-items-center">
				<Label inputId="page-size" class="page-size-label">
					{$_("common.labels.pageSize")}
				</Label>

				<div class="page-size-select">
					<InputGroup size="sm">
						<SvelteSelect
							value={pageSize}
							items={pageSizes}
							id="page-size"
							class="form-control form-control-sm"
							placeholder={$_("common.placeholders.pageSize")}
							searchable={false}
							on:select={updatePageSize}
							on:clear={() => updatePageSize({detail: {value: null}})}
						/>
					</InputGroup>
				</div>
			</div>
		{/if}

		<Pagination
			page={pagination.page || 1}
			pages={pages ?? 1}
			visiblePagesCount={3}
			class="pagination-sm mb-0"
			on:updatePage={onUpdatePage}
		/>
	</div>
</div>

<style lang="scss" global>
	.pagination-footer {
		gap: 0.5rem;

		.pagination {
			.page-size-label {
				margin-bottom: 0;
			}

			.page-size-select {
				width: 4.5rem;

				:global {
					.svelte-select {
						--selected-item-padding: 0;

						width: 100% !important;
						min-width: unset !important;
					}
				}
			}
		}
	}
</style>
