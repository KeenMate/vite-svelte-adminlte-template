<script lang="ts">
	import {run} from "svelte/legacy"

	import parsePagination from "@keenmate/js-common-helpers/helpers/pagination.js"
	import {pageUrl} from "@keenmate/js-common-helpers/helpers/url.js"
	import {onDestroy, onMount, setContext, tick} from "svelte"
	import {location, querystring} from "@keenmate/svelte-spa-router"
	import {parse} from "qs"
	import {_, locale} from "svelte-i18n"
	import {writable} from "svelte/store"
	import {NotificationProvider} from "@keenmate/svelte-adminlte"
	import {
		copyTranslationsAsync,
		createTranslationItemAsync,
		searchTranslationsAsync,
		TranslationsChannel,
		updateTranslationAsync
	} from "./channel.js"
	import ItemsTableCard from "./components/TranslationsTableCard.svelte"
	import type {CopyTranslations, TranslationsQuery} from "./types.js"
	import {PageUrls} from "$lib/pages/index.js"
	import type {PageSvelteContext, PaginationType} from "$lib/types/index.js"
	import {DifferentialStore} from "@keenmate/svelte-common-helpers/stores"
	import {PageSvelteContextKey} from "$lib/constants/svelte-context-keys.js"
	import {TranslationsPageFiltersKey} from "$lib/features/translations/constants.js"
	import {RouteLoadedSubject} from "$lib/streams/route-loaded.js"
	import {calculateQueryFiltersWithPreferencesAsync} from "$lib/helpers/querystring-filters.js"

	const query      = new DifferentialStore<object>({})
	const pagination = new DifferentialStore<PaginationType>({})
	const filters    = new DifferentialStore<TranslationsQuery>({})

	setContext<PageSvelteContext>(PageSvelteContextKey, {
		query,
		pageFiltersKey: TranslationsPageFiltersKey
	})

	const contextKey   = Symbol()
	const focusedRow   = writable(null)
	const focusedField = writable(null)
	setContext(contextKey, {
		updateFiltersUrl(query: object) {
			return pageUrl(
				PageUrls.admin.translations,
				{},
				{...query, page: null},
				true
			)
		},
		focusedRow,
		focusedField
	})

	let itemsTask: Promise<any>            = $state()
	let items: any[]                       = []
	let pages                              = $state(0)
	let filtersUpdated: Symbol | undefined = $state(undefined)


	onMount(() => {
		TranslationsChannel.join()

		const routeLoadedSubscription = RouteLoadedSubject.subscribe(onRouteLoadedAsync)

		return () => {
			routeLoadedSubscription.unsubscribe()
		}
	})

	onDestroy(() => {
		TranslationsChannel.leave()
	})

	async function onRouteLoadedAsync() {
		console.log("Route loaded")
		const queryIsReady = await calculateQueryFiltersWithPreferencesAsync(
			"translations",
			TranslationsPageFiltersKey,
			$query,
			$location
		)

		if (!queryIsReady) {
			return
		}

		filters.trySet({
			searchText:     $query.searchText,
			languageCode:   $query.languageCode,
			dataGroup:      $query.dataGroup,
			dataObjectCode: $query.dataObjectCode,
			dataObjectId:   $query.dataObjectId && Number($query.dataObjectId)
		} as TranslationsQuery)
		pagination.trySet(parsePagination($query))

		await tick()
		filtersUpdated = Symbol()
	}

	async function loadItemsAsync() {
		try {
			const {data, metadata} = await searchTranslationsAsync($filters, $pagination)
			items                  = data
			pages                  = metadata.pages
			pagination.update(x => {
				x.pageSize = metadata.pageSize

				return x
			})

			return items
		} catch (error) {
			console.error("Translations could not be loaded", error)
			NotificationProvider.error($_("translations.notifications.itemsNotLoaded"))

			return []
		}
	}

	function reload() {
		itemsTask = loadItemsAsync()
	}

	async function onSubmitAsync({detail: {item, index, callback}}: any) {
		try {
			if (!item || !item.languageCode || !item.dataGroup || !item.value) {
				NotificationProvider.warning(
					$_("translations.notifications.missingRequiredValues")
				)
				return
			}

			if (item.translationId) {
				await updateTranslationAsync(item)
				NotificationProvider.success(
					$_("translations.notifications.itemUpdated", {
						values: {title: item.dataObjectCode}
					})
				)

				$focusedRow = index
				items       = items.map(
					x => (x.translationId === item.translationId && item) || x
				)
			} else {
				await createTranslationItemAsync(item)
				NotificationProvider.success(
					$_("translations.notifications.itemCreated", {
						values: {title: item.dataObjectCode}
					})
				)

				reload()
			}

			callback()
		} catch (error) {
			console.error("Item could not be submitted", error, item)
			NotificationProvider.error($_("translations.notifications.itemNotSaved", {values: {title: item.title}}))
		}
	}

	async function onCopyTranslationsAsync({detail: {data, callback}}: {
		detail: { data: CopyTranslations; callback: VoidFunction }
	}) {
		try {
			console.log("real copy translations")

			await copyTranslationsAsync(data)

			reload()

			callback()
		} catch (error) {
			console.error("Error occurred while copying translations", error, data)
			NotificationProvider.error(
				$_("translations.notifications.itemsNotCopied")
			)
		}
	}

	$effect(() => {
		query.trySet(parse($querystring ?? ""))
	})
	$effect(() => {
		itemsTask = filtersUpdated && ($locale, loadItemsAsync())
	})
</script>

<ItemsTableCard
	{contextKey}
	filters={$filters}
	pagination={$pagination}
	{pages}
	{itemsTask}
	on:reload={reload}
	on:submit={onSubmitAsync}
	on:copyTranslations={onCopyTranslationsAsync}
/>
