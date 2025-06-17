import {parse, stringify} from "qs"
import {dropNullValues} from "$lib/helpers/object-helpers.js"
import {getActivePage, isPageActive} from "$lib/helpers/page-helpers.js"
import {Preferences, updatePageFiltersPreference} from "$lib/stores/preferences.js"
import {get} from "svelte/store"
import {isEqual} from "lodash"
import {updateQuerystringPartialAsync} from "@keenmate/js-common-helpers/helpers/router.js"

export function stringifyFilters(
	filters: object | null | undefined,
	partial: object | null | undefined,
	mapper = (x: object): object => x,
	shouldDropNullValues: boolean = true
) {
	let effectiveFilters = {
		...filters,
		...partial
	}

	let mappedFilters = mapper(effectiveFilters)

	if (shouldDropNullValues) {
		mappedFilters = dropNullValues(mappedFilters)
	}
	// Object.keys(mappedFilters)
	// 	.forEach(key => {
	// 		if (!mappedFilters[key])
	// 			delete mappedFilters[key]
	// 	})

	return stringify(mappedFilters, {arrayFormat: "brackets"})
}

export function parseQuerystringFilters(querystring: string, parser = (x: any) => x) {
	if (!querystring) return parser({})

	const qsParsed = parse(querystring)

	return parser(qsParsed)
}

export async function calculateQueryFiltersWithPreferencesAsync(currentPage: string, pageFiltersKey: string, query: object, location: string): Promise<boolean> {
	//await tick()
	const preferences = get(Preferences)

	// console.log("On query changed", {
	// 	isPageActive: isPageActive(location, currentPage, true),
	// 	location,
	// 	getActivePage: getActivePage(location)
	// })
	if (!isPageActive(location, currentPage, true)) {
		return false
	}

	if (Object.keys(query).length === 0 && preferences.pageFilters[pageFiltersKey] && Object.keys(preferences.pageFilters[pageFiltersKey]).length > 0) {
		// console.log("Setting query from preferences", query, preferences.pageFilters[pageFiltersKey])
		await updateQuerystringPartialAsync(preferences.pageFilters[pageFiltersKey], true)
		return false
	} else if (isEqual(query, preferences.pageFilters[pageFiltersKey])) {
		// console.log("Query and filters are same")
	} else {
		// console.log("Updating preferences from query", query, preferences.pageFilters[pageFiltersKey])
		updatePageFiltersPreference(pageFiltersKey, query)
	}

	// console.log("Query changed and page is ready", {...query})
	return true
}
