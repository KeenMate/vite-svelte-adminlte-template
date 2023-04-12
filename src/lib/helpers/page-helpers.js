import {getDuplicateValues} from "$lib/helpers/array-helpers.js"
import {stringifyFilters} from "$lib/helpers/querystring-filters.js"
import {joinPaths} from "$lib/helpers/string-helpers.js"
import {Pages} from "$lib/pages"
import {customPageTitleUsed, pageTitle} from "$lib/stores/page-title.js"
import {parse} from "qs"
import {querystring} from "svelte-spa-router"
import {get} from "svelte/store"

export function pageUrl(url, params, qsObject, keepQuerystring = false) {
	return pageHref
		.apply(null, arguments)
		.replace("#", "")
}

export function pageHref(url, params, qsObject, keepQuerystring = false) {
	if (!url)
		return "javascript:void(0)"

	const baseUrl = "#" + fillParams(url, params)
	let querystringStr = stringifyFilters({
		...(keepQuerystring && parse(get(querystring)) || {}),
		...(qsObject || {})
	})

	if (querystringStr.length)
		querystringStr = "?" + querystringStr

	return baseUrl + querystringStr
}

/**
 * Replaces url placeholders with values from params
 * @param pageUrl {string}
 * @param params {object}
 * @returns {string}
 */
export function fillParams(pageUrl, params = {}) {
	if (!params)
		return removeParamsPlaceholders(pageUrl)

	const pageUrlKeys = getPageUrlParams(pageUrl)

	return pageUrlKeys
		.reduce((acc, key) => acc.replace(new RegExp(`:${key}\\??`), params[key] || ""), pageUrl)
}

function getPageUrlParams(pageUrl) {
	return Array.from(pageUrl.matchAll(/:([a-zA-Z_]+)\??/g))
		.map(x => x[1])
}

export function removeParamsPlaceholders(pageUrl) {
	return pageUrl.replace(/:\w+\??/, "")
}

export function pageUrlToRegex(pageUrl, exactMatch = false) {
	if (!pageUrl) {
		console.trace("No page url given")
		return new RegExp(/`/)
	}

	const regex = "^" + pageUrl.replace(/\/:\w+(\??)/, "/?([\\w\\-d]+)$1") + (exactMatch && "$" || "")
	return new RegExp(regex)
}

export function getPagesForUrl(pageUrl) {
	const testRoute = routeUrl => pageUrlToRegex(routeUrl).test(pageUrl)

	const result = []

	Pages.forEach(route => {
		if (route.url !== "/" && testRoute(route.url))
			result.push(route)

		if (route.nesting)
			route.subroutes.forEach(sub => {
				if (testRoute(joinPaths(route.url, sub.url)))
					result.push(sub)
			})
	})

	return result
}

export function pageIsActive(location, pageName) {
	const currentMatchedPages = getPagesForUrl(location)

	const pageUrlExactRegex = new RegExp(pageUrlToRegex(location, true))

	const exactMatchPage = currentMatchedPages.find(x => pageUrlExactRegex.test(x.url))

	return exactMatchPage
		? exactMatchPage.name === pageName
		: currentMatchedPages
			.map(x => x.name)
			.includes(pageName)
}

export function getPage(name) {
	return Pages.find((o) => o.name === name)
}

export async function onRouteLoaded(route, i18n) {
	const page = Pages.find(x => x.url === route.route)

	if (!page || get(customPageTitleUsed))
		return

	pageTitle.set(typeof page.title === "function"
		? await page.title(i18n)
		: page.title
	)
}
