/**
 * Removes created/modified keys from current object in-place
 * @returns {Object} this
 */
export function removeTemplateTimestamps(object) {
	if (!object)
		return null

	delete object.createdBy
	delete object.created
	delete object.modifiedBy
	delete object.modified

	return object
}


/**
 * Used to extract only specific keys into dedicated object
 * @param object {object} Keys to extract
 * @param keys {string[]} Keys to extract
 * @returns {object} Object with specified keys if any
 */
export function take(object, keys) {
	if (!object || !keys?.length)
		return {}

	return Object.keys(object)
		.filter(x => keys.includes(x))
		.reduce((acc, x) => (acc[x] = object[x], acc), {})
}

/**
 * Used to drop specified keys from object
 */
export function dropKeys(object, keys) {
	if (!object || !keys?.length)
		return {}

	return Object.keys(object)
		.filter(x => !keys.includes(x))
		.reduce((acc, x) => (acc[x] = object[x], acc), {})
}

export function prefixKeys(object, prefix) {
	if (!object)
		return null

	return Object.entries(object)
		.reduce((acc, [key, value]) => {
			acc[prefix + key] = value

			return acc
		}, {})
}

export function getPrefixedKeys(object, prefix) {
	if (!object)
		return null

	return Object.keys(object).filter(x => x.startsWith(prefix))
}

export function extractPrefixedKeys(object, prefix, preservePrefix = false) {
	if (!object)
		return null

	return getPrefixedKeys(object, prefix)
		.reduce((acc, x) => {
			const replacedKey = preservePrefix ? x : x.replace(prefix, "")
			acc[replacedKey] = object[x]

			return acc
		}, {})
}

export function exceptPrefixedKeys(object, prefix) {
	if (!object)
		return null

	const keysToExclude = getPrefixedKeys(object, prefix)

	return Object.keys(object)
		.reduce((acc, x) => {
			if (!keysToExclude.includes(x))
				acc[x] = object[x]

			return acc
		}, {})
}
