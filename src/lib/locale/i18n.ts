import {userContext} from "$lib/stores/authentication.js"
import {get} from "svelte/store"
import {init, locale, addMessages} from "svelte-i18n"
import defaultLanguages from "./langs.json"

export {locale, defaultLanguages}

const locales = import.meta.glob("./locales/*.json", {import: "default"})

initialize()

function initialize() {
  const currentLocale = get(userContext).currentLocale

  init({
    fallbackLocale: "en",
    initialLocale:
      currentLocale?.value ||
      localStorage.getItem("language") ||
      getSupportedUserLanguage()
  })

  loadLocale(get(locale))
}

function getSupportedUserLanguage() {
  const langCodes = getUserContextLanguages().map(l => l.code)
  return window.navigator.languages.find(l => langCodes.includes(l))
}

export function getFlagPath(countryCode) {
  return "images/flags/" + countryCode.substring(0, 2) + ".png"
}

export function changeLang(locale_: string) {
  if (getUserContextLanguages().find(x => x.code === locale_.substring(0, 2))) {
    localStorage.setItem("language", locale_)
  } else {
    console.log("ERROR: language " + locale_, " does not exist")
  }
}

async function loadLocale(locale_: string) {
  const messages = (await locales[`./locales/${locale_}.json`]()) as any
  addMessages(locale_, messages)
}

function getUserContextLanguages() {
  return get(userContext).languages || defaultLanguages
}
