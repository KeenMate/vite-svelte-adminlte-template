import debounce from "lodash/debounce.js"
import values from "lodash/values.js"

export function historyDebounce(fn: Function, wait: number, ...restArguments: any[]) {
	let args: any[][] = []
	let deb           = debounce(
		() => {
			fn.call(undefined, args)
			args = []
		},
		wait,
		...restArguments
	)

	return function (..._args: any[]) {
		args = [...args, values(arguments)]
		deb()
	}
}
