import BaseProvider from "./base-provider.js"
import {POST} from "$lib/constants/methods.js"
import {SetCurrentLocaleUrl} from "$lib/constants/urls.js"

export class MeProvider extends BaseProvider {
	setCurrentLocaleAsync(languageCode) {
		return this.fetchResourceAsync(POST, SetCurrentLocaleUrl, {languageCode}, undefined, false)
	}

	// async updateMyself(email, phone) {
	// 	const response = await this.fetchResource(PATCH, UserProfileUrl, {email, phone})
	//
	// 	return response.metadata
	// }
}

export default new MeProvider()
