import {get} from "svelte/store"
import {init, locale, addMessages} from "svelte-i18n"
import langs from "./langs.json"
import {LocaleI18nMessagesUrl} from "../constants/urls"

export {locale, langs}
export const languages = JSON.parse(document.getElementById("langs")?.value || "null") || langs

// export let locales = {"cs": cs, "en": en, "de": de}
initialize()

function initialize() {
	const metaCurrentLocale = document.getElementById("current-locale")

	init({
		fallbackLocale: "en",
		initialLocale: metaCurrentLocale?.value
			|| localStorage.getItem("language")
			|| getSupportedUserLanguage()
	})

	loadLocale(get(locale))
}

function getSupportedUserLanguage() {
	const langCodes = languages.map(l => l.code)
	return window.navigator
		.languages
		.find(l => langCodes.includes(l))
}

export function getFlagPath(countryCode) {
	return "images/flags/" + countryCode.substring(0, 2) + ".png"
}

export function changeLang(lang) {
	if (languages.find((x) => x.code === lang.substring(0, 2))) {
		console.log("changing lang to:", lang)
		locale.set(lang)
		localStorage.setItem("language", lang)
	} else {
		console.log("ERROR: language " + lang, " does not exist")
	}
}

function loadLocale(locale_) {
	fetch(LocaleI18nMessagesUrl(locale_))
		.then(response => response.json())
		.then(messages => {
			console.log("Locale loaded", locale_, messages)
			addMessages(locale_, messages)
		})
}
