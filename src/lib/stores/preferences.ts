import {persisted} from "svelte-persisted-store"
import {type UserPreferences} from "$lib/types/preferences.js"
import {stringifyFilters} from "@keenmate/js-common-helpers/helpers/querystring-filters.js"
import {parse} from "qs"

export const DefaultPreferences: Readonly<UserPreferences> = {
	pageFilters: {}
} as const

export const Preferences = persisted<UserPreferences>("preferences", DefaultPreferences, {
	// this is now done only once when the app loads (in App.svelte) to speed things up
	//beforeRead(x) {
	//	return Object.assign({}, DefaultPreferences, x)
	//}
})

export function updatePageFiltersPreference(page: string, filters: object | null | undefined, isPartial: boolean = false) {
	Preferences.update(value => {
		if (filters) {
			let newFilters = filters

			if (isPartial) {
				newFilters = {
					...value.pageFilters[page],
					...newFilters
				}
			}

			value.pageFilters[page] = parse(stringifyFilters(newFilters))
		} else {
			delete value.pageFilters[page]
		}

		return value
	})
}

/**
 * Fills missing preferences values from default ones so that every field is ensured to be filled
 */
export function ensurePreferencesOrDefault() {
	Preferences.update(value => {
		return {
			...DefaultPreferences,
			...value
		}
	})
}

export function toggleAddressesMapSidebarExpansion() {
	Preferences.update(value => {
		value.addressesMapSidebarExpanded = !value.addressesMapSidebarExpanded

		return value
	})
}

export function updateUserTableShowEmailInsteadOfUsername(newValue: boolean) {
	Preferences.update(value => {
		value.userTableShowEmailInsteadOfUsername = newValue

		return value
	})
}
