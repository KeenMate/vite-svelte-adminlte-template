import {writable} from "svelte/store"
import {setHtmlTitle} from "../helpers/router-html-title"

export const pageTitle = writable()
export let pageTitleSet = writable(false)

export function setCustomPageTitle(title) {
	pageTitle.set(title)
	pageTitleSet.set(true)
}

export function listenPageTitleChanged() {
	return pageTitle.subscribe(title => {
		setHtmlTitle(title)
	})
}
