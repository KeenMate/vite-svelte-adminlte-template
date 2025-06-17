import TranslationsProvider from "$lib/providers/translations-provider.js"
import {UserContext} from "$lib/stores/authentication.js"
import {get} from "svelte/store"
import {init, locale, register} from "svelte-i18n"
import defaultLanguages from "./default-languages.json"
import type {LanguageItem} from "$lib/features/translations/types.js"

export {defaultLanguages}

const LocalLocales = import.meta.glob("./locales/*.json", {import: "default"})

export async function initializeTranslationsAsync(currentLocale: string) {
	const initialLocale = currentLocale || getSupportedUserLanguage()

	//console.log("Initializing i18n with init locale: ", initialLocale, get(locales))
	await init({
		fallbackLocale: "en",
		initialLocale
	})
}

export function registerLocales(languageCodes: string[] | null) {
	//console.log("Registering locales", languageCodes);

	if (!languageCodes?.length) {
		registerLocale("en")
		return
	}

	languageCodes.forEach(registerLocale)
}

function registerLocale(languageCode: string) {
	register(languageCode, async () => {
		if (import.meta.env.DEV) {
			//console.log("loading locales from file because of dev mode")
			const translations = await LocalLocales[`./locales/${languageCode}.json`]()
			//console.log("DEV translations: ", languageCode, translations)

			return translations
		} else {
			try {
				// console.log("Getting translations", languageCode)
				const {data} = await TranslationsProvider.getGroupTranslationsAsync(languageCode, "backend_translations")
				//console.log("Got translations", languageCode, data)

				return data
			} catch (error) {
				console.error("Error occurred while loading current locale's translations", error, languageCode)
			}
		}
	})
}


export async function getFlagImagePathAsync(countryCode: string) {
	const countryCodeIso2 = countryCode.substring(0, 2)
	return (await import(`../../assets/images/flags/${countryCodeIso2}.png`)).default
}

export function changeLang(languageCode: string) {
	if (getUserContextLanguages().find((x: LanguageItem) => x.code === languageCode.substring(0, 2))) {
		locale.set(languageCode)
	} else {
		console.error("ERROR: language ", languageCode, " does not exist")
	}
}

function getSupportedUserLanguage() {
	const availableLanguageCodes = getUserContextLanguages().map((x: LanguageItem) => x.code)
	return window.navigator
		.languages
		.find(l => availableLanguageCodes.includes(l))
}

function getUserContextLanguages() {
	return get(UserContext).languages || defaultLanguages
}
