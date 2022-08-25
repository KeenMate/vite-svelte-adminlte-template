import debounce from "lodash/debounce"
import values from "lodash/values"

export function historyDebounce(fn, wait, ...restArguments) {
	let args = []
	let deb = debounce(() => {
		fn.call(undefined, args)
		args = []
	}, wait, ...restArguments)

	return function () {
		args = [...args, values(arguments)]
		deb()
	}
}
