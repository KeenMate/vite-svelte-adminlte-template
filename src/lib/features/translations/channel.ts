import {Channel} from "$lib/providers/socket/channel.js"
import Socket, {savePushAsync} from "$lib/providers/socket/index.js"
import type {CopyTranslations, Translation, TranslationsQuery} from "./types.js"
import {type Channel as ChannelType, pushSocketMessageAsync} from "@keenmate/js-common-helpers/socket/channel.js"
import type {PaginationType} from "$lib/types/index.js"
import type {PagedPushResponse} from "$lib/types/channel-types.js"

export const TranslationsChannel: ChannelType = new Channel(Socket, "translations:lobby")

export async function createTranslationItemAsync(item: Translation) {
	const c = await TranslationsChannel.getAsync()

	return await pushSocketMessageAsync<any>(c, "create", item)
}

export async function searchTranslationsAsync(query: TranslationsQuery, pagination: PaginationType): Promise<PagedPushResponse<Translation>> {
	// ! THIS WILL NOT WORK IF ID CAN BE 0
	// TODO FIX
	// !

	if (query.dataObjectId === 0) {
		query.dataObjectId = null
	}
	// console.log(query)

	return await savePushAsync<PagedPushResponse<Translation>>(TranslationsChannel, "search", {
		...query,
		...pagination
	})
}

export async function updateTranslationAsync(item: Partial<Translation>) {
	const c = await TranslationsChannel.getAsync()

	return await pushSocketMessageAsync<any>(c, "update", item)
}

export async function copyTranslationsAsync(data: CopyTranslations) {
	const c = await TranslationsChannel.getAsync()

	return await pushSocketMessageAsync<any>(c, "copy_translations", data)
}
