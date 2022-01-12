import {get} from "svelte/store"
import {setHtmlTitle} from "../helpers/router-html-title"
import {customPageTitleUsed, pageTitle} from "../stores/page-title"
import Home from "./Home.svelte"
import Page1 from "./Page1.svelte"
import NotFound from "./NotFound.svelte"
import Error from "./Error.svelte"

export const Pages = [
	{
		name: "Error",
		title: "Error",
		url: "/error",
		breadcrumb: ["Error"],
		hide: true
	},
	{
		name: "Home",
		title: "Home",
		url: "/",
		breadcrumb: ["Route 1"],
		icon: "fas fa-home",
		hide: false
	},
	{
		name: "Page1",
		title: "Page 1",
		url: "/page1",
		breadcrumb: ["Page 1"],
		icon: "fas fa-file",
		hide: false
	}
]

export const PageUrls = Pages.reduce((acc, x) => {
	if (x.nesting)
		acc[x.name] = x.subroutes
			.reduce((subAcc, subX) => {
				subAcc[subX.name] = subX.url
				return subAcc
			}, {})
	else
		acc[x.name] = x.url

	return acc
}, {})

export function fillParams(pageUrl, params) {
	return Object
		.keys(params)
		.reduce(
			(acc, key) => acc.replace(`:${key}`, params[key]),
			pageUrl
		)
}

export function pageUrlToRegex(pageUrl, exactMatch = false) {
	return "^" + pageUrl.replace(/\/:\w+(\??)/, "/?([\\w\\-d]+)$1") + (exactMatch && "$" || "")
}

export function getPagesForUrl(pageUrl) {
	const pageRegex = new RegExp(pageUrlToRegex(pageUrl))

	const result = []

	Pages.forEach(route => {
		if (route.nesting) {
			route.subroutes.forEach(sub => {
				if (pageRegex.test(sub.url))
					result.push(sub)
			})
		} else if (pageRegex.test(route.url))
			result.push(route)
	})

	return result
}

export function pageIsActive(location, page) {
	const currentMatchedPages = getPagesForUrl(location)

	const pageUrlExactRegex = new RegExp(pageUrlToRegex(location, true))
	console.log("Checking page active: ", currentMatchedPages, page)

	const exactMatchPage = currentMatchedPages.find(x => pageUrlExactRegex.test(x.url))

	return exactMatchPage
		? exactMatchPage.name === page.name
		: currentMatchedPages
			.map(x => x.name)
			.includes(page.name)
}

export function getPage(name) {
	return Pages.find((o) => o.name === name)
}

export async function onRouteLoaded(route) {
	const page = Pages.find(x => x.url === route.route)

	if (!page || get(customPageTitleUsed))
		return

	pageTitle.set(typeof page.title === "function"
		? await page.title()
		: page.title
	)
}

export default {
	[PageUrls.Home]: Home,
	[PageUrls.Page1]: Page1,
	[PageUrls.Error]: Error,
	// The catch-all route must always be last
	"*": NotFound
}
