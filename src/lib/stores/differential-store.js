import {isEqual} from "lodash"
import {writable} from "svelte/store"


/**
 * Store for prevent "updated" but very same value from propagating through system, forcing to reload everything
 */
export class DifferentialStore {
	originalValue
	store
	loggingKey

	constructor(initialValue = undefined, loggingKey = null) {
		// console.log("Creating ModifiedReactive class", initialValue, loggingKey)
		this.store = writable(initialValue)
		this.originalValue = initialValue
		this.loggingKey = loggingKey
	}
	
	subscribe() {
		return this.store.subscribe.apply(this.store, arguments)
	}

	set(newVal) {
		if (this.loggingKey)
			console.trace(`[${this.loggingKey}] Modified reactive SET: `, newVal, this.originalValue, isEqual(this.originalValue, newVal) && "EQUAL" || "DIFFERENT")
		
		this.originalValue = newVal
		
		return this.store.set(newVal)
	}
	
	trySet(newVal) {
		if (this.loggingKey)
			console.trace(`[${this.loggingKey}] Modified reactive TRYSET: `, newVal, this.originalValue, isEqual(this.originalValue, newVal) && "EQUAL" || "DIFFERENT")
		
		if (isEqual(this.originalValue, newVal))
			return

		this.set(newVal)
	}
}
// export default function (initialValue = undefined, loggingKey = null) {
// 	const store = writable(initialValue)
// 	const {set, subscribe} = store
//	
// 	return {
// 		originalValue: initialValue,
// 		set(newVal) {
// 			this.originalValue = newVal
// 			return set(newVal)
// 		},
// 		trySet(newVal) {
// 			if (loggingKey)
// 				console.debug(`[${loggingKey}] Modified reactive SET: `, newVal, this.originalValue, isEqual(this.originalValue, newVal))
// 			if (isEqual(this.originalValue, newVal))
// 				return
//
// 			this.originalValue = newVal
// 			set(newVal)
// 		},
// 		subscribe
// 	}
// }
