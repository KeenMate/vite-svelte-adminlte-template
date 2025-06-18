import { mount } from 'svelte'
import "bootstrap/dist/js/bootstrap.min.js"
import "admin-lte/dist/js/adminlte.min.js"
import "@validide/resizable-table-columns"
import "$lib/config.js"
import "./assets/css/global.scss"
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
		ctx = await loadUserContextAsync() || ctx
	}

	// locale and translations
	registerLocales(ctx?.languages?.map((x: LanguageItem) => x.code))
	await initializeTranslationsAsync(ctx?.currentLocale)

	await waitLocale(ctx.currentLocale)

	//console.log("Locale initialized. Creating app", get(locale))
	return mount(App, {
	  target: document.getElementById('app')!,
	})
}

export default createApp()
