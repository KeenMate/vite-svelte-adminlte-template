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

	type Props = {
		tags: string[] | null;
		maxVisibleTags?: number;
		queryKey?: string;
		updateQuery?: (query: StringDict | object) => any;
		keepPagination?: boolean;
		noFiltering?: boolean;
		customFiltering?: boolean;
	}

	let {
		    tags,
		    maxVisibleTags  = 10,
		    queryKey        = "searchTags",
		    updateQuery     = updateQuerystringPartialAsync,
		    keepPagination  = false,
		    noFiltering     = false,
		    customFiltering = false
	    }: Props = $props()

	const {query, pageFiltersKey} = getContext<PageSvelteContext>(PageSvelteContextKey)
	const queryContext            = getContext<QueryContext>(QueryContextKey)

	let visibleTags        = $derived(tags?.slice(0, maxVisibleTags))
	let areTagsTrimmed     = $derived(tags?.length !== visibleTags?.length)
	let queryKeyWithPrefix = $derived(queryContext?.queryPrefix && queryKey
		? queryContext?.queryPrefix + queryKey
		: queryKey)

	function onItemClicked(item: string) {
		if (noFiltering || customFiltering) {
			dispatch("itemClicked", item)
		} else {
			if (!queryKeyWithPrefix) {
				throw new Error("Missing `queryKey` param when attempted to update query")
			}

			const originalQuery  = get(query)
			const newQuery: any  = {}
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
