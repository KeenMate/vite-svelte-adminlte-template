import {derived, get, writable} from "svelte/store"
import {Config, Toastr} from "@keenmate/svelte-adminlte"
import ContextProvider from "$lib/providers/context-provider.js"
import {ErrorToastrTimeout} from "$lib/constants/toastr.js"
import type {SessionUser, UserContextType} from "$lib/types/authentication.js"
import {getUserContextFromHtml} from "$lib/constants/index.js"
import {LogSessionTimeoutSessionKey, SessionTimeoutReducterSecondsSessionKey} from "$lib/constants/authentication.js"

// Stores
export const UserContext = writable<UserContextType>(getUserContextFromHtml())

export const CurrentUser = {
	subscribe(subscription: (value: SessionUser) => void) {
		return Config.subscribe((config) => {
			// TODO fix currentUser type
			//@ts-ignore
			subscription(config.currentUser)
		})
	},
	update(value: SessionUser) {
		return Config.update((config) => {
			// TODO fix currentUser type
			//@ts-ignore
			config.currentUser = {...config.currentUser, ...value}
			return config
		})
	},
	set(value: SessionUser) {
		return Config.update((config) => {
			// TODO fix currentUser type
			//@ts-ignore
			config.currentUser = value
			return config
		})
	}
}

export const IsAuthenticated = derived(CurrentUser, (currentUser) => !!currentUser?.userId, false)

export const LastSeenNotificationId = writable(null)

export async function loadUserContextAsync(): Promise<UserContextType | null> {
	try {
		const {data} = await ContextProvider.getUserContextAsync()

		UserContext.set(data)

		return data
	} catch (error: any) {
		if (error.status === 401) {
			console.debug("User context not loaded because user is unauthenticated", error)
			return null
		}

		console.error("Could not load user context", error)
		Toastr.error("User context could not be loaded", null, {
			timeOut: ErrorToastrTimeout
		})

		return null
	}
}

export function stopLogSessionTimeoutInterval(forGood: boolean = false) {
	if (forGood) {
		localStorage.removeItem(LogSessionTimeoutSessionKey)
	}

	// @ts-ignore
	if (window.sessionTimeoutInterval) {
		// @ts-ignore
		clearInterval(window.sessionTimeoutInterval)
	}
}

export function startLogSessionTimeoutInterval(delayMs: number) {
	stopLogSessionTimeoutInterval()

	// @ts-ignore
	window.sessionTimeoutInterval = setInterval(() => {
		let {sessionTimeout} = get(UserContext)

		// dev purposes
		const timeoutShortener = localStorage.getItem(SessionTimeoutReducterSecondsSessionKey)
		if (timeoutShortener && !isNaN(timeoutShortener as any)) {
			sessionTimeout = sessionTimeout - Number(timeoutShortener)
		}

		const nowUnixSeconds            = Math.round(new Date().getTime() / 1000)
		const sessionTimeoutSecondsDiff = sessionTimeout && (sessionTimeout - nowUnixSeconds)
		console.info("[SESSION] Remaining seconds for session expiration: ", sessionTimeoutSecondsDiff)
	}, delayMs)
}

// @ts-ignore
window.logSessionTimeoutInterval = (delayMs?: number | false) => {
	const logSessionTimeoutConfig = localStorage.getItem(LogSessionTimeoutSessionKey)

	if (delayMs === false) {
		// @ts-ignore
		if (window.sessionTimeoutInterval) {
			// @ts-ignore
			clearInterval(window.sessionTimeoutInterval)
		}
		localStorage.removeItem(LogSessionTimeoutSessionKey)
		return
	}
	if (!delayMs) {
		delayMs = logSessionTimeoutConfig
			&& Number(logSessionTimeoutConfig)
			|| 5 * 60 * 1000
	}
	if (delayMs.toString() !== logSessionTimeoutConfig) {
		localStorage.setItem(LogSessionTimeoutSessionKey, delayMs.toString())
	}

	startLogSessionTimeoutInterval(delayMs)
}

UserContext.subscribe((ctx) => {
	// TODO fix currentUser type
	//@ts-ignore
	CurrentUser.set(ctx.user)
})
