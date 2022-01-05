import {init, getLocaleFromNavigator, locale, addMessages, json, register} from "svelte-i18n"

import en from "./en.json"
import cs from "./cs.json"
import langs from "./langs.json"
import {registerLocaleLoader} from "svelte-i18n/types/runtime/includes/loaderQueue"


export {locale, locales, langs}
export const languages = langs

let locales = {"cs": cs, "en": en}
initialize()


function initialize() {
	langs.forEach((lang) => {
		let lc = localStorage.getItem(lang.code + "-locale")
		if (lc != null) {
			console.log("loading from ls" + lang.code)
			addMessages(lang.code, JSON.parse(lc))
			locales[lang.code] = JSON.parse(lc)
		} else {
			addMessages(lang.code, locales[lang.code])
		}
	})

	init({
		fallbackLocale: "cs",
		initialLocale: localStorage.getItem("language") || getLocaleFromNavigator()
	})

}

export function getFlagPath(countryCode) {
	let lang = languages.find((x) => x.code === countryCode.substring(0, 2))
	return lang
		? "img/flags/" + lang.img + ".png"
		: ""
}

export function saveLanguageFile(json, lang) {
	addMessages(lang, json)
	localStorage.setItem(lang + "-locale", JSON.stringify(json))

}

export function deleteSaveLocals() {

	let keys, i
	keys = Object.keys(localStorage)
	i = keys.length

	while (i--) {
		if (keys[i].substring(3) === "locale") {
			localStorage.removeItem(keys[i])
		}
	}

	console.log("deleting saved locals")
	location.reload()
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
