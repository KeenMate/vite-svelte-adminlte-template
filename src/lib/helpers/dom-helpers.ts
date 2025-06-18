/**
 * This version of safeScrollIntoView is ensuring to wait until the scroll process has finished
 * @param element
 */
export function safeScrollIntoViewAsync(element: HTMLElement): Promise<void> {
	const scroller = getNearestAutoScrollParent(element)

	let onScrollEnd: (ev: Event) => void

	return new Promise<void>(resolve => {
		onScrollEnd = () => resolve()

		scroller?.addEventListener("scrollend", onScrollEnd)

		safeScrollIntoView(element)
	}).finally(() => {
		scroller?.removeEventListener("scrollend", onScrollEnd)
	})
}

// Fixed version of scrollIntoView, without block and inline the scroll moves whole page up and hides navigation
/**
 * Scrolls the element into the view.
 * NOTE: does not wait for scroll to finish (on some environments at least) => use async version in case of troubles instead
 * @param element
 */
export function safeScrollIntoView(element: HTMLElement) {
	element.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"})
}

export function scrollElementToTop(el: HTMLElement) {
	// safeScrollIntoView(el)
	const scroller     = document.querySelector(".content-wrapper > .content")!
	const scrollerRect = scroller.getBoundingClientRect()
	const targetRect   = el.getBoundingClientRect()

	// get el's top position relative to scroller
	const topDiff = Math.abs(scrollerRect.top - targetRect.top)

	// compute resulting scroll height of scroller
	// original scroll + relative diff - spacing
	const targetScrollerScroll = scroller.scrollTop + (topDiff - 20)

	console.log("scrollElementToTop", scroller, el, targetRect)
	console.log("scrollElementToTop", {topDiff, targetScrollerScroll})

	scroller.scroll({
		behavior: "smooth",
		left:     0,
		top:      targetScrollerScroll
	})
}

export function getNearestAutoScrollParent(element: HTMLElement) {
	return getElementParents(element)
		.find(x => x.classList.contains("auto-scroll"))
}

export function getNearestAutoScrollChild(element: HTMLElement): HTMLElement {
	return element.querySelector(".auto-scroll")
}

export function getElementParents(element: HTMLElement): HTMLElement[] {
	if (!element.parentElement) {
		return []
	}

	let results: HTMLElement[] = [element.parentElement]
	let parentElement: HTMLElement | null
	do {
		parentElement = results[results.length - 1].parentElement

		if (parentElement) {
			results.push(parentElement)
		}
	} while (parentElement)

	return results.reverse()
}
