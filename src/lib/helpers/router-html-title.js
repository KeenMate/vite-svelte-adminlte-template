import {BaseHtmlTitle} from "../constants/ui"

export function setHtmlTitle(newTitle, absolute = false) {
	document.title = absolute
		? newTitle
		: (newTitle && `${newTitle} • ${BaseHtmlTitle}` || BaseHtmlTitle)
}
