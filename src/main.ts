import "bootstrap/dist/js/bootstrap.min.js"
import "admin-lte/dist/js/adminlte.min.js"
import "@validide/resizable-table-columns"
import "$lib/config.js"
import "./assets/css/main.scss"
import {get} from "svelte/store"
import {initializeTranslationsAsync, registerLocales} from "$lib/locale/i18n.js"
import {waitLocale} from "svelte-i18n"
import {loadUserContextAsync, UserContext} from "$lib/stores/authentication.js"
import type {UserContextType} from "$lib/types/authentication.js"
import App from "./App.svelte"
import type {LanguageItem} from "$lib/features/translations/types.js"
import {BasePath} from "@keenmate/svelte-spa-router"

BasePath.set(import.meta.env.BASE_URL)

async function createApp() {
	let ctx: UserContextType | null = get(UserContext)
	if (import.meta.env.DEV) {
		ctx = await loadUserContextAsync()
	}

	// locale and translations
	registerLocales(ctx?.languages?.map((x: LanguageItem) => x.code))
	await initializeTranslationsAsync(ctx?.currentLocale)

	if (ctx?.currentLocale) {
		await waitLocale(ctx.currentLocale)
	} else {
		//throw new Error("Missing user context or context does not have a currentLocale prop")
		await waitLocale()
	}

	//console.log("Locale initialized. Creating app", get(locale))
	return new App({
		target: document.getElementById("app") as Element
	})
}

export default createApp()
