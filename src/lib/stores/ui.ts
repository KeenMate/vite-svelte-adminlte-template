import {readable} from "svelte/store"
import {fromEvent, throttleTime} from "rxjs"

export const IsPageBodyScrolling = elementScrolling(document.body)

export const PageResized = fromEvent(window, "resize", (_ev: UIEvent) => {
	return {
		innerWidth:  window.innerWidth,
		innerHeight: window.innerHeight
	}
})
	.pipe(throttleTime(250, undefined, {trailing: true}))

export function elementScrolling(element: HTMLElement) {
	return readable(false, (set) => {
		const onScroll    = () => {
			console.log("onScroll")
			set(true)
		}
		const onScrollEnd = () => {
			console.log("onScrollEnd")
			set(false)
		}

		element.addEventListener("scroll", onScroll)
		element.addEventListener("scrollend", onScrollEnd)

		return () => {
			element.removeEventListener("scroll", onScroll)
			element.removeEventListener("scrollend", onScrollEnd)
		}
	})
}
