Object.prototype.anyKeyTruthy = function () {
	return Object.keys(this)
		.some(x => this[x])
}

/**
 * Removes created/modified keys from current object in-place
 * @returns {Object} this
 */
Object.prototype.removeTemplateTimestamps = function () {
	delete this.createdBy
	delete this.created
	delete this.modifiedBy
	delete this.modified

	return this
}

/**
 * Used to extract only specific keys into dedicated object
 * @param keys {string[]} Keys to extract
 * @returns {Object} Object with specified keys if any
 */
Object.prototype.take = function (keys) {
	if (!keys?.length)
		return {}

	return Object.keys(this)
		.filter(x => keys.includes(x))
		.reduce((acc, x) => (acc[x] = this[x], acc), {})
}
