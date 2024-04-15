import {LoginUrl, AppUrl} from "$lib/constants/urls.js"
import JwtDecode from "jwt-decode"
import {
  ContentType,
  Authorization
} from "@keenmate/js-common-helpers/constants/headers.js"
import {Json} from "@keenmate/js-common-helpers/constants/content-types.js"
import {LocalStorageAccessTokenKey} from "$lib/constants/keys"
import {GET} from "@keenmate/js-common-helpers/constants/methods.js"
import {NotificationProvider, Toastr} from "@keenmate/svelte-adminlte"

type headers = {[key: string]: string}

export default class BaseProvider {
  static accessToken: string
  static localStorageAccessTokenTried = false

  /**
	 * Unified fetch helper
	 * @param method {string} Method of HTTP request
	 * @param url {string} Just url
	 * @param body {any} Request body (if method is GET then this will be converted to querystring
	 * @param customHeaders {Header[]} Headers appended to HTTP request headers
	 * @param shouldDecode {Boolean} if set to true this method will try to decode response as json
	 // * @param requireAccessToken {Boolean} If set to true, will wait for access
	 * @param request {RequestInit}
	 * @throws {Response} if response status is not 200
	 * @return {Promise<Response | any>} If response's ContentType is set to json it automatically decodes given value
	 */
  async fetchResource(
    method: string,
    url: string,
    body: any = undefined,
    customHeaders: headers = null,
    shouldDecode: boolean = true,
    request: RequestInit = null
    // requireAccessToken = true
  ): Promise<Response | any> {
    // if (requireAccessToken && !BaseProvider.accessToken) {
    // 	await BaseProvider.fetchAccessTokenWithLoginRedirect(false)
    // }

    const headers = this.mergeHeaders(
      BaseProvider.getCommonHeaders(),
      customHeaders
    )
    try {
      const response = await fetch(
        url + ((method === GET && this.createQueryString(body)) || ""),
        {
          method,
          headers,
          credentials: "include",
          body: (method !== GET && JSON.stringify(body)) || undefined,
          ...(request || {})
        }
      )

      if (!response.ok) {
        console.error("Not OK result received", response)
        throw response
      }

      if (response.status === 401) {
        console.warn("resource returned 401 status. asking for access token")
        // window.open("/reauth", "_blank", "width=400,height=475");
        // await BaseProvider.fetchAccessTokenWithLoginRedirect(false)

        return this.fetchResource.apply(this, arguments)
      }
      if (response.status === 403) {
        // window.open("/reauth", "_blank", "width=400,height=475");
        NotificationProvider.error("Access denied")
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
  createQueryString(queryObject: object | null) {
    if (!queryObject) return ""

    const queryPairs = Object.keys(queryObject)
      .filter(key => queryObject[key])
      .map(key => `${key}=${encodeURI(queryObject[key] || "")}`)

    return (queryPairs.length && "?" + queryPairs.join("&")) || ""
  }

  /**
   * Used to get url of specific endpoint that given provider is made for
   */
  getEndpointUrl() {
    throw new Error(
      "Method `getEndpointUrl` must be overriden to provide specific api endpoint url"
    )
  }

  static clearSessionStorage() {
    localStorage.removeItem(LocalStorageAccessTokenKey)
  }

  /**
   * Merges tobeMerged into headers
   * @param headers  Headers to be merged into (is modified in-place)
   * @param tobeMerged {headers} Headers to merge
   * @return {Headers} Result (same as `headers` param, just for convenience)
   */
  mergeHeaders(headers: Headers, tobeMerged: headers): Headers {
    if (!tobeMerged || !tobeMerged.length) return headers

    // @ts-ignore
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
  static getContentType(headers: Headers): string | null {
    return headers.get(ContentType)
  }

  /**
   * Returns common headers used for communication with API
   * Contains authorization header that is filled with `BaseProvider.accessToken` therefore it assumes that its already set
   * @return {Headers}
   */
  static getCommonHeaders(): Headers {
    const headersObject = {
      [ContentType]: Json
    }

    if (BaseProvider.accessToken)
      headersObject[Authorization] = `Bearer ${BaseProvider.accessToken}`

    return new Headers(headersObject)
  }

  static redirectToLogin(redirectTo: string) {
    window.location.replace(BaseProvider.getLoginUrl(redirectTo))
  }

  static loginPopup(redirectTo: string) {
    const url = BaseProvider.getLoginUrl(redirectTo)
    console.log("Logging into", url)

    return window.open(url, "_blank", "width=400,height=475")
  }

  static getLoginUrl(redirectTo: string) {
    console.log({LoginUrl, AppUrl})
    return LoginUrl + (redirectTo ? "?redirect_to=" + redirectTo : "")
  }

  /**
   * Fetches global access token from API endpoint and stores it globally
   * @deprecated
   * @returns {Promise}
   */
  static async fetchAccessToken(): Promise<any> {
    // makes request manually (not using helpers from this class intentionally)
    // if (BaseProvider.fetchingAccessToken)
    // 	return new Promise(resolve => {
    // 		const interval = setInterval(() => {
    // 			if (BaseProvider.fetchingAccessToken || !BaseProvider.accessToken)
    // 				return
    // 			clearInterval(interval)
    // 			resolve()
    // 		}, 50)
    // 	})
    //
    // const tokenFromLocalStorage = localStorage.getItem(
    // 	LocalStorageAccessTokenKey
    // )
    // const now = new Date()
    //
    // if (
    // 	tokenFromLocalStorage
    // 	&& !BaseProvider.localStorageAccessTokenTried
    // ) {
    // 	const decodedToken = JwtDecode(tokenFromLocalStorage)
    // 	const tokenExp = new Date(decodedToken.exp * 1000)
    //
    // 	if (tokenExp > now) {
    // 		BaseProvider.localStorageAccessTokenTried = true
    // 		BaseProvider.accessToken = tokenFromLocalStorage
    // 		BaseProvider.setTokenRefreshTimer(decodedToken.exp)
    //
    // 		return
    // 	}
    // 	localStorage.removeItem(LocalStorageAccessTokenKey)
    // } else {
    // 	localStorage.removeItem(LocalStorageAccessTokenKey)
    // 	BaseProvider.localStorageAccessTokenTried = false
    // }
    //
    // BaseProvider.fetchingAccessToken = true
    //
    // const accessTokenResponse = await fetch(
    // 	`${AccessTokenPath}`,
    // 	{
    // 		method: "get",
    // 		credentials: "include"
    // 	}
    // )
    //
    // BaseProvider.fetchingAccessToken = false
    //
    // if (!accessTokenResponse.ok && accessTokenResponse.status === 401) {
    // 	console.error("Response is 401")
    // 	localStorage.removeItem(LocalStorageAccessTokenKey)
    // 	throw new Error(401)
    // }
    //
    // if (
    // 	accessTokenResponse.headers
    // 		.get("content-type")
    // 		.indexOf("application/json") === -1
    // )
    // 	throw new Error("Access token should have arrived with json content type")
    //
    // const decodedBody = await accessTokenResponse.json()
    // BaseProvider.setAccessToken(decodedBody.access_token)
  }

  static setTokenRefreshTimer(exp: number) {
    const tokenExpDate = new Date(exp * 1000)
    const now = new Date()
    // @ts-ignore
    const requestTokenAfter = (tokenExpDate - now) * 0.9
    setTimeout(() => {
      BaseProvider.fetchAccessToken()
    }, requestTokenAfter)
  }

  static setAccessToken(token: string) {
    BaseProvider.accessToken = token
    BaseProvider.localStorageAccessTokenTried = false
    localStorage.setItem(LocalStorageAccessTokenKey, token)

    //@ts-ignore
    const newDecodedAccessToken: {exp: string} = JwtDecode(token)

    BaseProvider.setTokenRefreshTimer(parseInt(newDecodedAccessToken.exp))
  }

  static logout() {
    throw new Error("Logout not implemented")
    // localStorage.removeItem(LocalStorageAccessTokenKey)
    // window.location.href = `${DomainUrl}/auth/logout`
  }
}

export class RefreshTokenExpired extends Event {
  constructor() {
    super("refreshtokenexpired")
  }
}
