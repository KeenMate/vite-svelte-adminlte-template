/**
 * Removes created/modified keys from current object in-place
 * @returns {Object} this
 */
export function removeTemplateTimestamps(object) {
	if (!object) {
		return null
	}

	delete object.createdBy
	delete object.created
	delete object.modifiedBy
	delete object.modified

	return object
}

/**
 * Used to extract only specific keys into dedicated object
 * @param object {object | null} Keys to extract
 * @param keys {string[] | null} Keys to extract
 * @returns {object} Object with specified keys if any
 */
export function take(object, keys) {
	if (!object || !keys?.length) {
		return {}
	}

	return Object.keys(object)
		.filter((x) => keys.includes(x))
		.reduce((acc, x) => ((acc[x] = object[x]), acc), {})
}

/**
 * Used to drop specified keys from object
 */
export function dropKeys(object, keys) {
	if (!object || !keys?.length) {
		return {}
	}

	return Object.keys(object)
		.filter((x) => !keys.includes(x))
		.reduce((acc, x) => ((acc[x] = object[x]), acc), {})
}

export function prefixKeys(object, prefix) {
	if (!object) {
		return null
	}

	return Object.entries(object).reduce((acc, [key, value]) => {
		acc[prefix + key] = value

		return acc
	}, {})
}

export function getPrefixedKeys(object, prefix) {
	if (!object) {
		return null
	}

	return Object.keys(object).filter((x) => x.startsWith(prefix))
}

export function extractPrefixedKeys(object, prefix, preservePrefix = false) {
	if (!object) {
		return null
	}

	return getPrefixedKeys(object, prefix)?.reduce((acc, x) => {
		const replacedKey = preservePrefix ? x : x.replace(prefix, "")
		acc[replacedKey]  = object[x]

		return acc
	}, {})
}

export function exceptPrefixedKeys(object, prefix) {
	if (!object) {
		return null
	}

	const keysToExclude = getPrefixedKeys(object, prefix)

	return Object.keys(object).reduce((acc, x) => {
		if (!keysToExclude.includes(x)) {
			acc[x] = object[x]
		}

		return acc
	}, {})
}

export function dropNullValues<T, TNull = null>(object: T, nullValue: TNull = null): Partial<T> | null {
	const result = Object.entries(object)
		.filter(([_key, value]) => value !== nullValue)
		.reduce((acc, [key, value]) => {
			acc[key] = value
			return acc
		}, {})

	if (!Object.keys(result).length) {
		return null
	}

	return result
}

export function keysToSnakeCase(object) {
	if (!object) {
		return object
	}

	return Object.entries(object)
		.map(([key, value]) => {
			return [
				key.replace(/[A-Z0-9]/g, (c) => {
					return "_" + c.toLowerCase()
				}),
				value
			]
		})
		.reduce((acc, [key, value]) => {
			acc[key] = value
			return acc
		}, {})
}

export function normalizeObjectQueryParam(object: object) {
	if (!object) {
		return null
	}

	return Object.fromEntries(
		Object.entries(object)
			.filter((x) => {
				if (x[1] instanceof Set) {
					return x[1].size
				} else if (x[1] instanceof Array) {
					return x[1].length
				}
				return x[1]
			})
			.map(x => {
				if (x[1] instanceof Set) {
					x[1] = Array.from(x[1].values())
				}
				return x
			})
	)
}
