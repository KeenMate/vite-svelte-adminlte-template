import {type Readable, type Updater, writable} from "svelte/store"

export type ReactiveSet<T> = Readable<Set<T>> & {
	add: ((...x: T[]) => Set<T>),
	setItems: ((...x: T[]) => Set<T>),
	clear: (() => void),
	set: (x: Set<T>) => void,
	update: ((updater: Updater<Set<T>>) => void),
	delete: ((x: T) => boolean)
}

export default function createReactiveSet<T>(initialValues: T[] = []): ReactiveSet<T> {
	const set = new Set<T>(initialValues)
	const store = writable(set)

	return {
		subscribe: store.subscribe,
		update: store.update,
		set: store.set,
		add(...values: T[]) {
			store.update(x => {
				for (const value of values) {
					x.add(value)
				}

				return x
			})

			return set
		},
		setItems(...values: T[]) {
			store.update(x => {
				x.clear()

				for (const value of values) {
					x.add(value)
				}

				return x
			})

			return set
		},
		clear() {
			store.update(x => {
				x.clear()
				return x
			})
		},
		delete(value: T) {
			let result: boolean

			store.update(x => {
				result = x.delete(value)
				return x
			})

			return result!
		}
	}
}
