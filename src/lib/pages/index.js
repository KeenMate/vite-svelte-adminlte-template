import {get} from "svelte/store"
import {customPageTitleUsed, pageTitle} from "../stores/page-title"
import {wrap} from "svelte-spa-router/wrap"
import LoadingPage from "./LoadingPage.svelte"
import NotFound from "./NotFound.svelte"

function translate(code) {
	return i18n => i18n(code)
}

export const Pages = [
	{
		name: "error",
		title: translate("routes.error.title"),
		url: "/error",
		breadcrumb: [translate("routes.error.title")],
		hide: true
	},
	{
		name: "home",
		title: translate("routes.home.title"),
		url: "/",
		breadcrumb: [translate("routes.home.title")],
		icon: "fas fa-home",
		hide: false
	},
	{
		name: "page1",
		title: translate("routes.page1.title"),
		url: "/page1",
		breadcrumb: [translate("routes.page1.title")],
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

const routerPages = {
	"/loading": LoadingPage,

	[PageUrls.home]: wrap({
		asyncComponent: () => import("../features/home/Page.svelte"),
		loadingComponent: LoadingPage
	}),
	[PageUrls.page1]: wrap({
		asyncComponent: () => import("../features/page1/Page.svelte"),
		loadingComponent: LoadingPage
	}),
	[PageUrls.error]: wrap({
		asyncComponent: () => import("./Error.svelte"),
		loadingComponent: LoadingPage
	}),
	// The catch-all route must always be last
	"*": NotFound
}

export default routerPages
