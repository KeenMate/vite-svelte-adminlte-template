import {parse} from "qs"
import {get} from "svelte/store"
import {location, push, querystring, replace} from "svelte-spa-router"
import {stringifyFilters} from "./querystring-filters"

export function updateQuerystringPartial(object, shouldReplace = false) {
	return updateQuerystring({
		...parse(get(querystring)),
		...object
	}, shouldReplace)
}

export function updateQuerystring(object, shouldReplace = false) {
	const newQuery = stringifyFilters(object)

	const magic = shouldReplace && replace || push
	return magic(`${get(location)}?${newQuery}`)
}
