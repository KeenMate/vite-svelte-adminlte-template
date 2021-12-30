import Route1 from "./routes/Route1.svelte"
import NotFound from "./routes/NotFound.svelte"
import Error from "./routes/Error.svelte"

export const Routes = [
	{
		name: "Error",
		title: "Error",
		route: "/error",
		breadcrumb: ["Error"],
		hide: true
	},
	{
		name: "Route1",
		title: "Route 1",
		route: "/",
		breadcrumb: ["Route 1"],
		icon: "fas fa-file",
		hide: false
	}
]

export const Urls = Routes.reduce((acc, x) => {
	acc[x.name] = x.route
	return acc
}, {})

export function fillParams(route, params) {
	return Object
		.keys(params)
		.reduce(
			(acc, key) => acc.replace(`:${key}`, params[key]),
			route
		)
}

export function routeToRegex(route) {
	return "^" + route.replace(/\/:\w+(\??)/, "/?([\\w-d]+)$1") + "$"
}

export function getRoute(name) {
	return Routes.find((o) => o.name === name).route
}

export default {
	[Urls.Route1]: Route1,
	[Urls.Error]: Error,
	// The catch-all route must always be last
	"*": NotFound
}
