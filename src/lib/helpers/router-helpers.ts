import {parse} from "qs"
import {get} from "svelte/store"
import {location, push, querystring, replace} from "@keenmate/svelte-spa-router"
import {stringifyFilters} from "@keenmate/js-common-helpers/helpers/querystring-filters.js"

/**
 * Custom implementation of keenmate/js-common-helpers/helpers/router.js's function using functions from @keenmate/svelte-spa-router
 * instead of original svelte-spa-router
 * @param object
 * @param shouldReplace
 * @param indexedArray
 */
export async function updateQuerystringPartialAsync(object: any, shouldReplace = false, indexedArray = false) {
	return updateQuerystringAsync({
		...parse(get(querystring) ?? ""),
		...object
	}, shouldReplace, indexedArray)
}

/**
 * Custom implementation of keenmate/js-common-helpers/helpers/router.js's function using functions from @keenmate/svelte-spa-router
 * instead of original svelte-spa-router
 * @param object
 * @param shouldReplace
 * @param indexedArray
 */
export async function updateQuerystringAsync(object: any, shouldReplace = false, indexedArray = false) {
	const newQuery = stringifyFilters(object, {}, (x) => x, {arrayFormat: indexedArray ? "indices" : "brackets"})
	const magic    = (shouldReplace && replace) || push
	return await magic(`${get(location)}?${newQuery}`)
}

//# sourceMappingURL=router.js.map
