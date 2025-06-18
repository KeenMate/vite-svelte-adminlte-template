import {wrap} from "@keenmate/svelte-spa-router/wrap"
import LoadingPage from "./LoadingPage.svelte"
import NotFound from "./NotFound.svelte"
import type {PageUrlsDict, RouterPages, TranslationText} from "./pages.js"
import {type Page, Pages} from "./pages.js"
import type {SvelteComponent} from "svelte"
import {mergeRequirements, type Requirements} from "@keenmate/js-common-helpers/helpers/permissions.js"
import {CurrentUser} from "$lib/stores/authentication.js"
import {Config} from "@keenmate/svelte-adminlte"
import {get} from "svelte/store"
import type {RouteDetail} from "@keenmate/svelte-spa-router"
import type {SessionUser} from "$lib/types/authentication.js"
import type {RouteUserData} from "$lib/types/pages.js"

export const PageUrls: PageUrlsDict = Pages.reduce((acc, x) => {
	if (x.nesting && x.subroutes) {
		acc[x.name] = x.subroutes.reduce((subAcc, subX) => {
			subAcc[subX.name] = subX.url
			return subAcc
		}, {} as PageUrlsDict)
	} else {
		acc[x.name] = x.url
	}

	return acc
}, {} as PageUrlsDict)

export function getFilteredPages(currentUser: SessionUser): Page[] {
	return filterPages(currentUser, Pages)
}

export function url(page: PageUrlsDict | string): string {
	if (typeof page === "string") {
		return page
	}

	throw new Error(`Given page is not a final url: ${JSON.stringify(page)}`)
}

function filterPages(currentUser: SessionUser, pages: Page[]): Page[] {
	return pages.filter((page) => {
		const effectiveRequirements = getPageEffectiveRequirements(page)

		const isAllowed = checkRequirements(currentUser, effectiveRequirements)

		if (isAllowed && page.subroutes) {
			page.subroutes = filterPages(currentUser, page.subroutes)
		}

		return isAllowed
	})
}

function convertToRouterPages(pages: Page[]): RouterPages {
	const routes: RouterPages = {}
	addPagesToRoutes(pages, routes)

	// console.log("routes", routes)
	return routes
}

function addPagesToRoutes(pages: Page[], routes: RouterPages) {
	pages.forEach((page) => {
		if (page.subroutes) {
			addPagesToRoutes(page.subroutes, routes)
		}
		if (!page.component) {
			return
		}

		const effectiveRequirements = getPageEffectiveRequirements(page)

		routes[page.url] = wrap({
			asyncComponent:   page.component,
			loadingComponent: LoadingPage as typeof SvelteComponent,
			conditions:       [permissionCondition],
			userData:         {requirements: effectiveRequirements} as RouteUserData
		})
	})
}

function permissionCondition(detail: RouteDetail): boolean {
	//console.log("permissionCondition", detail, get(CurrentUser))

	const effectiveRequirements = (detail.userData as RouteUserData)?.requirements ?? {}

	return checkRequirements(get(CurrentUser), effectiveRequirements)
}

function checkRequirements(currentUser: SessionUser, requirements: Requirements): boolean {
	return (
		get(Config).permissions.checkPermissions(currentUser, requirements) ||
		get(Config).permissions.checkRoles(currentUser, requirements)
	)
}

function getPageEffectiveRequirements(page: Page) {
	const effectiveRequirements = page.requirements ?? {any: [], all: []}
	if (page.anyNestedRequirements) {
		return mergeRequirements(effectiveRequirements, getSubroutesRequirements(page.subroutes ?? []))
	}
	return effectiveRequirements
}

function getSubroutesRequirements(subroutes: Page[]): Requirements {
	const subPermissions = subroutes
		?.map((sub) => {
			return mergeRequirements(getSubroutesRequirements(sub.subroutes ?? []), sub.requirements)
		})
		.reduce(mergeRequirements, {any: [], all: []})

	return subPermissions
}

export function translate(code: string): TranslationText {
	return (i18n: (code: string) => string) => i18n(code)
}

const routerPages: RouterPages = {
	"/loading": LoadingPage as typeof SvelteComponent,
	...convertToRouterPages(Pages),
	// The catch-all route must always be last
	"*": NotFound as typeof SvelteComponent
}

export default routerPages
export {Pages} from "./pages.js"
