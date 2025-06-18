import JwtDecode from "jwt-decode"
import {Authorization, ContentType} from "$lib/constants/headers.js"
import {Json} from "$lib/constants/content-types.js"
import {AccessTokenUrl, LoginUrl} from "$lib/constants/urls.js"
import {GET} from "$lib/constants/methods.js"
import {Toastr} from "@keenmate/svelte-adminlte"
import {ErrorToastrTimeout} from "$lib/constants/toastr.js"

export default class BaseProvider {
	static accessToken: string | null | undefined
	static fetchingAccessToken: boolean = false

	/**
	 * Unified fetch helper
	 * @param method {string} Method of HTTP request
	 * @param url {string} Just url
	 * @param body {any} Request body (if method is GET then this will be converted to querystring
	 * @param customHeaders {Headers} Headers appended to HTTP request headers
	 * @param shouldDecode {Boolean} if set to true this method will try to decode response as json
	 // * @param requireAccessToken {Boolean} If set to true, will wait for access
	 * @throws {Response} if response status is not 200
	 * @return {Promise<Response | any>} If response's ContentType is set to json it automatically decodes given value
	 */
	async fetchResourceAsync(
		method: string,
		url: string,
		body                             = undefined,
		customHeaders                    = null,
		shouldDecode                     = true,
		customFetchSettings: RequestInit = null
		// requireAccessToken = true
	) {
		// if (requireAccessToken && !BaseProvider.accessToken) {
		// 	await BaseProvider.fetchAccessTokenWithLoginRedirect(false)
		// }

		const headers = this.mergeHeaders(BaseProvider.getCommonHeaders(), customHeaders)
		try {
			const requestSettings = {
				method,
				headers,
				credentials: "include",
				body:        (method !== GET && JSON.stringify(body)) || undefined,
				...customFetchSettings
			}
			const response        = await fetch(
				url + ((method === GET && this.createQueryString(body)) || ""),
				requestSettings
			)

			if (!response.ok) {
				console.error("Not OK result received", response)
				throw response
			}

			if (response.status === 401) {
				console.warn("resource returned 401 status. asking for access token")
				// window.open("/reauth", "_blank", "width=400,height=475");
				// await BaseProvider.fetchAccessTokenWithLoginRedirect(false)

				return this.fetchResourceAsync.apply(this, arguments)
			}
			if (response.status === 403) {
				// window.open("/reauth", "_blank", "width=400,height=475");
				Toastr.error("You are not authorized to do this action", null, {
					timeOut: ErrorToastrTimeout
				})
				return null
			}

			return (shouldDecode && response.json()) || response
		} catch (res) {
			throw res
		}
	}

	/**
	 * Creates query string from given object
	 * @param queryObject {object?}
	 */
	createQueryString(queryObject) {
		if (!queryObject) {
			return ""
		}

		const queryPairs = Object.keys(queryObject)
			.filter((key) => queryObject[key])
			.map((key) => `${key}=${encodeURI(queryObject[key] || "")}`)

		return (queryPairs.length && "?" + queryPairs.join("&")) || ""
	}

	/**
	 * Used to get url of specific endpoint that given provider is made for
	 */
	getEndpointUrl() {
		throw new Error(
			"Method `getEndpointUrl` must be overridden to provide specific api endpoint url"
		)
	}

	/**
	 * Merges tobeMerged into headers
	 * @param headers {Headers} Headers to be merged into (is modified in-place)
	 * @param tobeMerged {Header[]} Headers to merge
	 * @return {Headers} Result (same as `headers` param, just for convenience)
	 */
	mergeHeaders(headers, tobeMerged) {
		if (!tobeMerged || !tobeMerged.length) {
			return headers
		}

		tobeMerged.forEach(({key, value}) => {
			headers.append(key, value)
		})

		return headers
	}

	/**
	 * Used to retrieve content type header
	 * @param headers {Headers}
	 * @return {string | null}
	 */
	static getContentType(headers) {
		return headers.get(ContentType)
	}

	/**
	 * Returns common headers used for communication with API
	 * Contains authorization header that is filled with `BaseProvider.accessToken` therefore it assumes that its already set
	 * @return {Headers}
	 */
	static getCommonHeaders() {
		const headersObject = {
			[ContentType]: Json
		}

		if (BaseProvider.accessToken) {
			headersObject[Authorization] = `Bearer ${BaseProvider.accessToken}`
		}

		return new Headers(headersObject)
	}

	static async fetchAccessTokenWithLoginRedirect(withRedirect = true) {
		try {
			await BaseProvider.fetchAccessToken()
		} catch (err) {
			console.error("Got error during fetching access token", err)

			if (err.message == 401) {
				if (withRedirect) {
					BaseProvider.redirectToLogin()
				} else {
					window.dispatchEvent(new RefreshTokenExpired())
				}
			}
		}
	}

	static redirectToLogin(redirectTo) {
		window.location.replace(BaseProvider.getLoginUrl(redirectTo))
	}

	static loginPopup(redirectTo) {
		const url = BaseProvider.getLoginUrl(redirectTo)
		console.log("Logging into", url)

		return window.open(url, "_blank", "width=400,height=475,resizable=false")
	}

	static getLoginUrl(redirectTo) {
		return LoginUrl + (redirectTo ? "?redirect_to=" + redirectTo : "")
	}

	/**
	 * Fetches global access token from API endpoint and stores it globally
	 * @returns {Promise}
	 */
	static async fetchAccessToken() {
		// makes request manually (not using helpers from this class intentionally)

		if (BaseProvider.fetchingAccessToken) {
			return new Promise((resolve) => {
				const interval = setInterval(() => {
					if (BaseProvider.fetchingAccessToken || !BaseProvider.accessToken) {
						return
					}
					clearInterval(interval)
					resolve()
				}, 50)
			})
		}

		try {
			BaseProvider.fetchingAccessToken = true

			const accessTokenResponse = await fetch(AccessTokenUrl, {
				method:      "get",
				credentials: "include"
			})

			if (accessTokenResponse.status === 401) {
				console.error("Response is 401")
				throw new Error(401)
			}

			if (accessTokenResponse.headers.get("content-type").indexOf("application/json") === -1) {
				throw new Error("Access token should have arrived with json content type")
			}

			const decodedBody = await accessTokenResponse.json()
			BaseProvider.setAccessToken(decodedBody)
		} finally {
			BaseProvider.fetchingAccessToken = false
		}
	}

	static setTokenRefreshTimer(exp) {
		const tokenExpDate      = new Date(exp * 1000)
		const now               = new Date()
		const requestTokenAfter = (tokenExpDate - now) * 0.9
		setTimeout(() => {
			BaseProvider.fetchAccessToken()
		}, requestTokenAfter)
	}

	static setAccessToken(token) {
		BaseProvider.accessToken = token

		const newDecodedAccessToken = JwtDecode(token)

		BaseProvider.setTokenRefreshTimer(newDecodedAccessToken.exp)
	}
}

export class RefreshTokenExpired extends Event {
	constructor() {
		super("refreshtokenexpired")
	}
}

// BaseProvider.fetchAccessTokenWithLoginRedirect()
