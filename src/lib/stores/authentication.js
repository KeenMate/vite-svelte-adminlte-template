import {getCurrentLocale, getCurrentUser, getLanguages, getSessionTimeout, getSocketToken} from "$lib/constants/index.js"
import {derived, writable} from "svelte/store"

// Stores
export let userContext = writable({
	currentLocale: getCurrentLocale(),
	currentUser: getCurrentUser(),
	languages: getLanguages(),
	sessionTimeout: getSessionTimeout(),
	socketToken: getSocketToken()
})

export const currentUser = derived(userContext, ctx => ctx?.currentUser, null)

export const isAuthenticated = derived(currentUser, currentUser => !!currentUser?.uuid, false)

export const lastSeenNotificationId = writable(null)
