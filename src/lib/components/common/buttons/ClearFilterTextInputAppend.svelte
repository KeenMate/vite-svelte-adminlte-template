<script lang="ts">
	import {InputGroupAppend, LteButton} from "@keenmate/svelte-adminlte"
	import {updateQuerystringPartialAsync} from "@keenmate/js-common-helpers/helpers/router.js"
	import type {PageSvelteContext, QueryContext, StringDict} from "$lib/types/index.js"
	import {updatePageFiltersPreference} from "$lib/stores/preferences.js"
	import {parse} from "qs"
	import {stringifyFilters} from "@keenmate/js-common-helpers/helpers/querystring-filters.js"
	import {getContext} from "svelte"
	import {PageSvelteContextKey, QueryContextKey} from "$lib/constants/svelte-context-keys.js"
	import {get} from "svelte/store"
	import {prefixKeys} from "@keenmate/js-common-helpers/helpers/object.js"

	type Props = {
		value: any;
		queryKey?: string | undefined;
		keepPagination?: boolean;
		onRemove?: (() => any) | undefined;
		updateQuery?: (query: StringDict | object) => any;
	}

	let {
		    value,
		    queryKey       = undefined,
		    keepPagination = false,
		    onRemove       = undefined,
		    updateQuery    = updateQuerystringPartialAsync
	    }: Props = $props()

	const masterDetailPageContext = getContext<PageSvelteContext | null>(PageSvelteContextKey)
	const queryContext            = getContext<QueryContext>(QueryContextKey)

	let queryKeyWithPrefix = $derived(queryContext?.queryPrefix && queryKey
		? queryContext?.queryPrefix + queryKey
		: queryKey)

	function onClear() {
		if (!queryKeyWithPrefix) {
			throw new Error("Missing `queryKey` param when attempted to update query")
		}

		let newQuery: any = {
			...masterDetailPageContext?.query && get(masterDetailPageContext.query),
			[queryKeyWithPrefix]: null
		}
		if (!keepPagination) {
			newQuery.page = null
		}

		if (masterDetailPageContext?.pageFiltersKey) {
			updatePageFiltersPreference(masterDetailPageContext.pageFiltersKey, newQuery)
		}

		updateQuery(newQuery)
	}
</script>

{#if value}
	<InputGroupAppend>
		<LteButton
			small
			on:click={onRemove || onClear}
		>
			<i class="fas fa-times fa-fw"></i>
		</LteButton>
	</InputGroupAppend>
{/if}
