import {derived} from "svelte/store"
import en_US from "@uppy/locales/lib/en_US"
import de_DE from "@uppy/locales/lib/de_DE"
import {locale} from "../locale/i18n"

export default derived(locale, async (currentLocale, set) => {
	switch (currentLocale) {
		case "de":
			set(de_DE)
			break
		default:
			set(en_US)
			break
	}
})
