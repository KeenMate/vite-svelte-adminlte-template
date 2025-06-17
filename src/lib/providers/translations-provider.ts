import BaseProvider from "./base-provider.js"
import {GetGroupTranslationsUrl} from "$lib/constants/urls.js"
import {GET} from "$lib/constants/methods.js"

export class TranslationsProvider extends BaseProvider {
	getGroupTranslationsAsync(languageCode: string, groupCode: string) {
		return this.fetchResourceAsync(GET, GetGroupTranslationsUrl(languageCode, groupCode))
	}
}

export default new TranslationsProvider()
