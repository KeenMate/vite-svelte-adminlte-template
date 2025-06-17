import {UserContextUrl} from "../constants/urls.js"
import BaseProvider from "./base-provider.js"
import {GET} from "$lib/constants/methods.js"

/**
 * For development purposes only
 */
class ContextProvider extends BaseProvider {
	getUserContextAsync() {
		return this.fetchResourceAsync(GET, UserContextUrl)
	}
}

export default new ContextProvider()
