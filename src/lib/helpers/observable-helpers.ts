import {Observable} from "rxjs"
import {readable, type Readable} from "svelte/store"

export function storeFromObservable<T>(observable: Observable<T>, defaultValue?: T): Readable<T> {
	return readable<T>(defaultValue, set => {
		const subscription = observable.subscribe(value => {
			set(value)
		})

		return subscription.unsubscribe
	})
}
