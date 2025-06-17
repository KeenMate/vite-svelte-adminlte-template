import {type Readable, writable} from "svelte/store"

type I18nOptions = object

type ErrorMessageItem<T> = {
	message: T,
	i18nOptions?: I18nOptions
}

export type ErrorMessagesStore<T> = Readable<ErrorMessageItem<T>[]> & {
	addErrorMessage(message: T, i18nOptions?: I18nOptions): void,
	removeErrorMessage(message: T): void,
	removeErrorMessages(...messages: T[]): void,
	clearAll(): void
}
export function createErrorMessagesStore<T>(): ErrorMessagesStore<T> {
	const {subscribe, set, update} = writable<ErrorMessageItem<T>[]>([])

	return {
		subscribe,
		addErrorMessage(message: T, i18nOptions?: I18nOptions) {
			update(value => {
				value.unshift({message, i18nOptions})

				return value
			})
		},
		removeErrorMessage(message: T) {
			update(value => {
				return value.filter(x => x.message !== message)
			})
		},
		removeErrorMessages(...messages: T[]) {
			update(value => {
				return value.filter(x => !messages.includes(x.message))
			})
		},
		clearAll() {
			set([])
		}
	}
}
