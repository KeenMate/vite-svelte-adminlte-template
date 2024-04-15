import {Pages} from "$lib/pages/pages.js"
import {customPageTitleUsed, pageTitle} from "$lib/stores/page-title.js"
import {get} from "svelte/store"
import {pageHref, pageUrlToRegex} from "@keenmate/js-common-helpers/helpers/url.js"
import type {Page, PageUrlsDict} from "$lib/pages/pages.js"

export function pageUrl(
	url: string | PageUrlsDict,
	params: {[key: string]: string | number | null} | null = null,
	qsObject: {[key: string]: string | number | null} | null = null,
	originalQs = null
) {
	// @ts-ignore
	return pageHref.apply(null, arguments).replace("#", "")
}

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

export function pageIsActive(location: string, pageName: string) {
	const currentMatchedPages = getPagesForUrl(location)

	const pageUrlExactRegex = new RegExp(pageUrlToRegex(location, true))

	const exactMatchPage = currentMatchedPages.find((x) => pageUrlExactRegex.test(x.url))

	return exactMatchPage
		? exactMatchPage.name === pageName
		: currentMatchedPages.map((x) => x.name).includes(pageName)
}

export function getPage(name: string) {
	return Pages.find((o) => o.name === name)
}

export async function onRouteLoaded(route: {route: string}, i18n: (code: string) => string) {
	//console.log("on route loaded", route, Pages)
	const matchingPages = getMatchingPages(Pages, pageUrl => pageUrl === route.route)
	const page = matchingPages.find((x) => x.url === route.route)

	if (!page || get(customPageTitleUsed)) return

	pageTitle.set(typeof page.title === "function" ? await page.title(i18n) : page.title)
}
