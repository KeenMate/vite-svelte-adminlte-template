import {stringifyFilters} from "@keenmate/js-common-helpers/helpers/querystring-filters"
import {joinPaths} from "@keenmate/js-common-helpers/helpers/string"
import {Pages} from "$lib/pages"
import {customPageTitleUsed, pageTitle} from "$lib/stores/page-title.js"
import {get} from "svelte/store"
import {pageUrlToRegex, pageHref} from "@keenmate/js-common-helpers/helpers/url"

export {pageHref, pageUrlToRegex} from "@keenmate/js-common-helpers/helpers/url"

export function pageUrl(url, params, qsObject, originalQs = null) {
	return pageHref.apply(null, arguments).replace("#", "")
}

export function getPagesForUrl(pageUrl) {
	const testRoute = routeUrl => pageUrlToRegex(routeUrl).test(pageUrl)

	const result = []

	Pages.forEach(route => {
		if (route.url !== "/" && testRoute(route.url)) result.push(route)

		if (route.nesting)
			route.subroutes.forEach(sub => {
				if (testRoute(joinPaths(route.url, sub.url))) result.push(sub)
			})
	})

	return result
}

export function pageIsActive(location, pageName) {
	const currentMatchedPages = getPagesForUrl(location)

	const pageUrlExactRegex = new RegExp(pageUrlToRegex(location, true))

	const exactMatchPage = currentMatchedPages.find(x =>
		pageUrlExactRegex.test(x.url)
	)

	return exactMatchPage
		? exactMatchPage.name === pageName
		: currentMatchedPages.map(x => x.name).includes(pageName)
}

export function getPage(name) {
	return Pages.find(o => o.name === name)
}

export async function onRouteLoaded(route, i18n) {
	const page = Pages.find(x => x.url === route.route)

	if (!page || get(customPageTitleUsed)) return

	pageTitle.set(
		typeof page.title === "function" ? await page.title(i18n) : page.title
	)
}
