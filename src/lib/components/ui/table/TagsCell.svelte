<script lang="ts">
	import {Badge} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import {createEventDispatcher, getContext} from "svelte"
	import type {PageSvelteContext, QueryContext, StringDict} from "$lib/types/index.js"
	import {PageSvelteContextKey, QueryContextKey} from "$lib/constants/svelte-context-keys.js"
	import {get} from "svelte/store"
	import {updatePageFiltersPreference} from "$lib/stores/preferences.js"
	import {updateQuerystringPartialAsync} from "@keenmate/js-common-helpers/helpers/router.js"

	const dispatch = createEventDispatcher()

	export let tags: string[] | null
	export let maxVisibleTags = 10
	export let queryKey: string = "searchTags"
	export let updateQuery: (query: StringDict | object) => any = updateQuerystringPartialAsync
	export let keepPagination = false
	export let noFiltering = false
	export let customFiltering = false

	const {query, pageFiltersKey} = getContext<PageSvelteContext>(PageSvelteContextKey)
	const queryContext = getContext<QueryContext>(QueryContextKey)

	$: visibleTags = tags?.slice(0, maxVisibleTags)
	$: areTagsTrimmed = tags?.length !== visibleTags?.length
	$: queryKeyWithPrefix = queryContext?.queryPrefix && queryKey
		? queryContext?.queryPrefix + queryKey
		: queryKey

	function onItemClicked(item: string) {
		if (noFiltering || customFiltering) {
			dispatch("itemClicked", item)
		} else {
			if (!queryKeyWithPrefix) {
				throw new Error("Missing `queryKey` param when attempted to update query")
			}

			const originalQuery = get(query)
			const newQuery: any = {}
			const newQueryFilter = originalQuery[queryKeyWithPrefix]?.split(",") || []
			if (newQueryFilter.includes(item)) {
				return
			} else {
				newQueryFilter.push(item)
			}
			newQuery[queryKeyWithPrefix] = newQueryFilter.join(",")

			if (!keepPagination) {
				newQuery.page = null
			}

			if (pageFiltersKey) {
				updatePageFiltersPreference(pageFiltersKey, newQuery)
			}

			updateQuery(newQuery)
		}
	}
</script>

<td
	class="tags-cell auto-width"
	class:no-filtering={noFiltering}
>
	<div class="d-flex align-items-center gap-1">
		{#each visibleTags || [] as item}
			<Badge
				class="badge-sm"
				color="secondary"
				title={$_("common.tooltips.clickToFilterBy")}
				on:click={() => onItemClicked(item)}
			>
				{item}
			</Badge>
		{/each}
		{#if areTagsTrimmed}
			<span>...</span>
		{/if}
	</div>
</td>

<style lang="scss">
	.tags-cell {
		:global {
			&:not(.no-filtering) {
				.badge {
					&:hover {
						cursor: pointer;
					}
				}
			}
		}
	}
</style>
