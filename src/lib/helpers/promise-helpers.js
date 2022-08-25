export const emptyPromise = new Promise(() => {})

export function timeoutPromise(timeout) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve()
		}, timeout)
	})
}
