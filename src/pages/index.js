import Home from "./Home.svelte"
import Page1 from "./Page1.svelte"
import NotFound from "./NotFound.svelte"
import Error from "./Error.svelte"
import {setHtmlTitle} from "../helpers/router-html-title"

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

export function pageUrlToRegex(pageUrl) {
	return "^" + pageUrl.replace(/\/:\w+(\??)/, "/?([\\w\\-d]+)$1") + "$"
}

export function getPage(name) {
	return Pages.find((o) => o.name === name)
}

export async function onRouteLoaded(route) {
	const page = Pages.find(x => x.url === route.route)

	if (!page)
		return

	const title = typeof page.title === "function"
		? await page.title()
		: page.title
	setHtmlTitle(title)
}

export default {
	[PageUrls.Home]: Home,
	[PageUrls.Page1]: Page1,
	[PageUrls.Error]: Error,
	// The catch-all route must always be last
	"*": NotFound
}
