import type {
	IPermissionsUser,
	Requirements
} from "@keenmate/js-common-helpers/helpers/permissions.js"
import {checkPermissions} from "@keenmate/js-common-helpers/helpers/permissions.js"
import {Config} from "@keenmate/svelte-adminlte"
import {BasePath, HashRoutingEnabled} from "@keenmate/svelte-spa-router"

HashRoutingEnabled.set(false)
BasePath.set(import.meta.env.BASE_URL)

Config.update((config) => {
	config.ToastrOptions = {
		...config.ToastrOptions,
		positionClass: "toast-bottom-right"
	}
	config.lazyLoader = {
		leaveLoaderFor: 300,
		waitForLoader: 150
	}
	config.permissions.checkRoles = (user: IPermissionsUser, requiredPermissions?: Requirements) => {
		const userRoleCodes: string[] = user?.roles?.map((x) => x.userGroupCode)
		return checkPermissions(userRoleCodes, requiredPermissions)
	}
	config.defaults.buttons.addButton.color = "primary"
	return config
})
