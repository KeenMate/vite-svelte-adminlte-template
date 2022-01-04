import Route1 from "./Route1.svelte"
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
		name: "Route1",
		title: "Route 1",
		url: "/",
		breadcrumb: ["Route 1"],
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

export default {
	[PageUrls.Route1]: Route1,
	[PageUrls.Error]: Error,
	// The catch-all route must always be last
	"*": NotFound
}
