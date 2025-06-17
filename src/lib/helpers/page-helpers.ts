import {Pages} from "$lib/pages/index.js"
import {customPageTitleUsed, pageTitle} from "$lib/stores/page-title.js"
import {get} from "svelte/store"
import type {Page} from "$lib/pages/pages.js"
import {pageUrlToRegex} from "@keenmate/js-common-helpers/helpers/url.js"
import orderBy from "lodash/orderBy.js"
import {RouteLoadedSubject} from "$lib/streams/route-loaded.js"
import type {RouteDetail} from "@keenmate/svelte-spa-router"

export function getPagesForUrl(pageUrl: any) {
	const testRoute = (routeUrl: string) => pageUrlToRegex(routeUrl).test(pageUrl)

	return getMatchingPages(Pages, testRoute)
}

function getMatchingPages(pages: Page[], tester: (url: string) => boolean): Page[] {
	const matchingPages: Page[] = []
	pages.forEach((page) => {
		if (page.url !== "/" && tester(page.url)) matchingPages.push(page)

		if (page.subroutes) {
			const subMatchingPages = getMatchingPages(page.subroutes, tester)
			matchingPages.push(...subMatchingPages)
		}
	})

	return matchingPages
}

export function getActivePage(location: string): Page | null {
	const currentMatchedPages = getPagesForUrl(location)
	// console.log("currentMatchedPages", currentMatchedPages)

	const pageUrlExactRegex = pageUrlToRegex(location, true)

	const exactMatchPage = currentMatchedPages.find(x =>
		pageUrlExactRegex.test(x.url)
	)

	const currentMatchedPagesSorted = orderBy(
		currentMatchedPages,
		x => x.url.length,
		["desc"]
	)

	return exactMatchPage || currentMatchedPagesSorted.find(_ => true) || null
}

export function findPageByName(pages: Page[], pageName: Page["name"]): Page | null {
	for (const page of pages) {
		if (page.name === pageName) {
			return page
		}

		if (page.nesting && page.subroutes?.length) {
			const nestedResult = findPageByName(page.subroutes, pageName)

			if (nestedResult) {
				return nestedResult
			}
		}
	}

	return null
}

export function isPageActive(location: string, pageName: string, exactMatch: boolean = false) {
	if (exactMatch) {
		const requestedPage = findPageByName(Pages, pageName)
		const requestedPageRegex = pageUrlToRegex(requestedPage.url, true)

		// console.log("Page is exact active results", {requestedPage, requestedPageRegex, location})
		return requestedPageRegex.test(location)
	} else {
		const currentMatchedPages = getPagesForUrl(location)

		// console.log("Page is active results", {currentMatchedPages, location})
		return currentMatchedPages.some(x => x.name === pageName)
	}
}

export function getPage(name: string) {
	return Pages.find((o) => o.name === name)
}

export async function onRouteLoaded(route: RouteDetail, i18n: (code: string) => string) {
	// console.log("on route loaded", route, Pages)
	RouteLoadedSubject.next(route)
	const matchingPages = getMatchingPages(Pages, pageUrl => pageUrl === route.route)
	const page = matchingPages.find((x) => x.url === route.route)

	if (!page || get(customPageTitleUsed)) return

	pageTitle.set(typeof page.title === "function" ? await page.title(i18n) : page.title)
}
