import {derived, writable, get} from "svelte/store"
import {UserManager, WebStorageStateStore} from "oidc-client"
import {AppUrl} from "../constants/urls"

export const AzureProvider = "AzureProvider"
export const ZuubrProvider = "ZuubrProvider"

const LocalStorageProviderKey = "AuthenticationProvider"

const azureConfiguration = {
	authority: "https://login.microsoftonline.com/[AUTHORITY_GUID]/v2.0/",
	client_id: "[CLIENT_ID]",
	redirect_uri: AppUrl, // TODO: configure
	post_logout_redirect_uri: AppUrl,
	response_type: "code",
	userStore: new WebStorageStateStore({prefix: "oidc.azure.", store: window.sessionStorage}),
	stateStore: new WebStorageStateStore({prefix: "oidc.azure.", store: window.localStorage}),
	scope: "openid profile email",
	automaticSilentRenew: true
}

const azureUserManager = createUserManager(azureConfiguration)
// const zuubrUserManager = createUserManager(zuubrConfiguration)

function setProvider(newProvider) {
	localStorage.setItem(LocalStorageProviderKey, newProvider)
	provider.set(newProvider)
}

function getUserManager(provider) {
	switch (provider) {
		case AzureProvider:
			return azureUserManager
		// case ZuubrProvider:
		// 	return zuubrUserManager
		default:
			return null
	}
}

/**
 * Stores
 */
export const provider = writable(localStorage.getItem(LocalStorageProviderKey) || null)
export const isLoading = writable(true)
export const isAuthenticated = writable(false)
export const accessToken = writable("")
export const idToken = writable("")
export const userInfo = writable({})
export const authError = writable(null)
export const userManager = derived(provider, $provider => getUserManager($provider))

/**
 * Refresh the accessToken using the silentRenew method (hidden iframe)
 *
 * @return bool indicated whether the token was refreshed, if false error will be set
 * in the authError store.
 */
export async function refreshToken() {
	const currentUserManager = get(userManager)

	if (!userManager)
		return false

	try {
		await currentUserManager.signinSilent()
		return true
	} catch (e) {
		// set error state for reactive handling
		authError.set(e.message)
		return false
	}
}

/**
 * Initiate Register/Login flow.
 *
 * @param newProvider
 * @param {boolean} preserveRoute - store current location so callback handler will navigate back to it.
 * @param {string} callbackUrl - explicit path to use for the callback.
 */
export async function login(newProvider, preserveRoute = true, callbackUrl = null) {
	setProvider(newProvider)

	// const redirect_uri = callback_url || window.location.href;
	const currentUserManager = get(userManager)

	if (!currentUserManager) {
		throw "no provider currently in use for login"
	}

	// try to keep the user on the same page from which they triggered login. If set to false should typically
	// cause redirect to /.
	const appState = preserveRoute
		? {
			pathname: window.location.pathname,
			search: window.location.search
		}
		: {} // TODO: fix route preservation
	await currentUserManager.signinRedirect(/*{ redirect_uri, appState }*/)
}

/**
 * Log out the current user.
 *
 * @param {string} logoutUrl - specify the url to return to after login.
 */
export async function logout(logoutUrl = null) {
	const returnTo = logoutUrl || window.location.href
	const currentUserManager = get(userManager)

	setProvider(null)

	currentUserManager.signoutRedirect({returnTo})

	if (!currentUserManager) {
		throw "no provider currently in use for logout"
	}

	try {
		const response = await currentUserManager.signoutRedirect({returnTo})
	} catch (err) {
		if (err.message !== "no end session endpoint") throw err
		// this is most likely auth0, so let's try their logout endpoint.
		// @see: https://auth0.com/docs/api/authentication#logout
		// this is dirty and hack and reaches into guts of the oidc client
		// in ways I'd prefer not to.. but auth0 has this annoying non-conforming
		// session termination.
		const authority = currentUserManager._settings._authority
		if (authority.endsWith("auth0.com")) {
			const clientId = currentUserManager._settings._client_id
			const url = `${authority}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(
				returnTo
			)}`
			window.location = url
		} else throw err
	}
}

function createUserManager(configuration) {
	const userManager = new UserManager(configuration)

	userManager.events.addUserLoaded(userLoadedCallback)
	userManager.events.addUserUnloaded(userUnloadedCallback)
	userManager.events.addSilentRenewError(silentRenewErrorCallback)

	return userManager
}

function userLoadedCallback(user) {
	isAuthenticated.set(true)
	accessToken.set(user.access_token)
	idToken.set(user.id_token)
	userInfo.set(user.profile)
}

function userUnloadedCallback() {
	provider.set(null)
	isAuthenticated.set(false)
	idToken.set("")
	accessToken.set("")
	userInfo.set({})
}

function silentRenewErrorCallback(error) {
	authError.set(`SilentRenewError: ${error.message}`)
}

export async function appMountCallback() {
	// Not all browsers support this, please program defensively!
	const params = new URLSearchParams(window.location.search)

	// Use 'error' and 'code' to test if the component is being executed as a part of a login callback. If we're not
	// running in a login callback, and the user isn't logged in, see if we can capture their existing session.
	if (!params.has("error") && !params.has("code") && !get(isAuthenticated)) {
		await refreshToken()
	}

	const currentUserManager = get(userManager)

	// Check if something went wrong during login redirect
	// and extract the error message
	if (params.has("error")) {
		authError.set(new Error(params.get("error_description")))
	}

	// if code then login success
	if (params.has("code")) {
		// handle the callback
		const response = await currentUserManager.signinCallback()
		let state = (response && response.state) || {}
		// Can be smart here and redirect to original path instead of root
		const url = state && state.targetUrl ? state.targetUrl : window.location.pathname
		state = {...state, isRedirectCallback: true}

		// redirect to the last page we were on when login was configured if it was passed.
		history.replaceState(state, "", url)
		// location.href = url;
		// clear errors on login.
		authError.set(null)
	}
		// if code was not set and there was a state, then we're in an auth callback and there was an error. We still
		// need to wrap the sign-in silent. We need to sit down and chart out the various success and fail scenarios and
	// what the uris loook like. I fear this may be problematic in other auth flows in the future.
	else if (params.has("state")) {
		const response = await currentUserManager.signinCallback()
		console.log("oidc.signinCallback::response", response)
	}

	isLoading.set(false)
}
