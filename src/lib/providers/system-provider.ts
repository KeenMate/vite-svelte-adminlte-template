import {SystemEnvironmentUrl, VersionsUrl} from "$lib/constants/urls.js"
import BaseProvider from "$lib/providers/base-provider.js"
import {GET} from "$lib/constants/methods.js"

/**
 * For development purposes only
 */
class SystemProvider extends BaseProvider {
	getSystemEnvironmentAsync() {
		return this.fetchResourceAsync(GET, SystemEnvironmentUrl)
	}

	getVersionsAsync() {
		return this.fetchResourceAsync(GET, VersionsUrl)
	}
}

export default new SystemProvider()
