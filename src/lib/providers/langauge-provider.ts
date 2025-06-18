import BaseProvider from "./base-provider.js"
import {POST} from "@keenmate/js-common-helpers/constants/methods.js"
import {LanguageApiUrl} from "../constants/urls.js"

export class LanguageProvider extends BaseProvider {
	async setLanguage(languageCode) {
		return this.fetchResource(
			POST,
			LanguageApiUrl,
			{languageCode},
			undefined,
			false
		)
	}
}

export default new LanguageProvider()
