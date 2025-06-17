export function getSavedSPARouterUrl() {
	return window.sessionStorage.getItem("original_svelte_spa_router")
}

export function removeSavedSPARouterUrl() {
	return window.sessionStorage.removeItem("original_svelte_spa_router")
}