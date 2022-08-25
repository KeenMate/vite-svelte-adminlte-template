export function anyKeyTruthy(t) {
	return Object.keys(t).some(k => t[k])
}

export function removeTemplateTimestamps(obj) {
	delete obj.createdBy
	delete obj.created
	delete obj.modifiedBy
	delete obj.modified
}
