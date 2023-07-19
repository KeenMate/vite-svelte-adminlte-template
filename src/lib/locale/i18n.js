import {userContext} from "$lib/stores/authentication.js"
import {get} from "svelte/store"
import {init, locale, addMessages} from "svelte-i18n"
import defaultLanguages from "./default-languages.json"

export {locale, defaultLanguages}

const locales = import.meta.glob("./locales/*.json", {import: "default"})

initialize()

function initialize() {
	const currentLocale = get(userContext).currentLocale

	init({
		fallbackLocale: "en",
		initialLocale: currentLocale?.value
			|| localStorage.getItem("language")
			|| getSupportedUserLanguage()
	})

	loadLocale(get(locale))
}

function getSupportedUserLanguage() {
	const langCodes = getUserContextLanguages().map(l => l.code)
	return window.navigator
		.languages
		.find(l => langCodes.includes(l))
}

export function getFlagPath(countryCode) {
	return "images/flags/" + countryCode.substring(0, 2) + ".png"
}

export function changeLang(lang) {
	if (getUserContextLanguages().find((x) => x.code === lang.substring(0, 2))) {
		localStorage.setItem("language", lang)
	} else {
		console.log("ERROR: language " + lang, " does not exist")
	}
}

async function loadLocale(locale_) {
	const messages = await locales[`./locales/${locale_}.json`]()
	addMessages(locale_, messages)
}

function getUserContextLanguages() {
	return get(userContext).languages || defaultLanguages
}
