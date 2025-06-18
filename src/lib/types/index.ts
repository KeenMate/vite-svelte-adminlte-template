import type {Readable, Writable} from "svelte/store"
import type {ErrorMessagesStore} from "$lib/stores/error-messages-store.js"

export type TemplateCreated = {
	created: string
	createdBy: string
}

export type TemplateTimestampsType = TemplateCreated & {
	modified: string
	modifiedBy: string
}

export type PaginationType = {
	page?: number
	pageSize?: number
}

export type OrderFiltersType = {
	orderBy?: string
	orderDirection?: "asc" | "desc"
}

export type CodeValueType = {
	code: string
	value: string | null
}

export type TabItemType = {
	code: string
	label: string
}

export type CodeTitleType<TCode = string> = {
	code: TCode
	title: string | null
}

export type CodeTitleColorType<TCode = string> = {
	color: string
} & CodeTitleType<TCode>

export type CodeTitleIconType<TCode = string> = {
	icon: string
} & CodeTitleType<TCode>

export type StringDict = { [key: string]: string | null }

export type SimpleValue = boolean | string | number | null

export type SystemEnvironmentType = {
	envBadgeTitle: string
	envBadgeColor: string
	versions: {
		appVersion: string
		dbVersion: string
	}
}

export type AppSvelteContext = {
	showConfirmModalAsync: Writable<(message_?: string | null, header_?: string | null, data_?: any) => Promise<boolean>>
	hideConfirmModalAsync: Writable<VoidFunction>
}

export type PageSvelteContext<T = {}> = {
	query?: Readable<StringDict>
	pageFiltersKey?: string
	errorMessages?: ErrorMessagesStore<any>
} & T

export type QueryContext = {
	queryPrefix?: string
}
