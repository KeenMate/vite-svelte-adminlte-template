import {derived} from "svelte/store"
// @ts-ignore
import en_US from "@uppy/locales/lib/en_US"
// @ts-ignore
import de_DE from "@uppy/locales/lib/de_DE"
import {locale} from "svelte-i18n"

export default derived(locale, (currentLocale, set) => {
	switch (currentLocale) {
		case "de":
			set(de_DE)
			break
		default:
			set(en_US)
			break
	}
})
