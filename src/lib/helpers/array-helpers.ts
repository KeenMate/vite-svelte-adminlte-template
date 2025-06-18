/**
 * @param array Array to iterate over
 * @param callback Called for every item of array with result of previous call
 * @param acc Initial value
 * @returns Last accumulator
 */
export function reduceWhile<TItem, TResult>(array: TItem[], callback: (acc: any, x: TItem) => {
	state: "cont" | "term",
	result: TResult
}, acc: TResult): TResult {
	if (!array?.length) {
		return acc
	}

	for (let i = 0; i < array.length; i++) {
		const {state, result} = callback(acc, array[i])

		if (state === "term") {
			return result
		} else if (state === "cont") {
			acc = result
		} else {
			throw new Error(`Received unexpected value ${state} when reducing array ${array}`)
		}
	}

	return acc
}

/**
 * Returns array of distinct values that are duplicated in the array
 */
export function getDuplicateValues<T>(array: T[]) {
	if (!array?.length) {
		return []
	}

	return array.filter((x, i, a) => a.indexOf(x) !== i).filter((x, i, a) => a.indexOf(x) === i)
}
