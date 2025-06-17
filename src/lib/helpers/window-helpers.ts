export function triggerPageResize() {
	window.requestAnimationFrame(() => {
		window.dispatchEvent(new Event("resize"))
	})
}