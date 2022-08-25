import {get} from "svelte/store"
import {location, push, replace} from "svelte-spa-router"
import {stringifyFilters} from "./querystring-filters"

export function updateQuerystring(querystringObject, shouldReplace = false) {
	const newQuery = stringifyFilters(querystringObject)

	const magic = shouldReplace && replace || push
	return magic(`${get(location)}?${newQuery}`)
}
