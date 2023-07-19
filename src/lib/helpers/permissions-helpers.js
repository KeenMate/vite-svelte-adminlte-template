export function checkPermissions(userPermissions, permissions) {
	if (!permissions?.length)
		return true

	if (!userPermissions || !userPermissions.length)
		return !(permissions?.any?.length || permissions?.all?.length)

	if (!permissions)
		return true
	if (permissions.any?.length)
		return !!userPermissions.find(x => permissions.any.includes(x))
	if (permissions.all?.length)
		return !permissions.all.filter(x => !userPermissions.includes(x)).length
}
