import CBuffer from "CBuffer"
import {writable} from "svelte/store"
import {DateTime} from "luxon"

import {Toastr} from "svelte-adminlte"

const MessageCount = 500

export const Warning = "Warning"
export const Success = "Success"
export const Error = "Error"

class NotificationProvider {
	constructor() {
		this.buffer = new CBuffer(MessageCount)
		this.messages = writable([])
	}

	#saveMessage(type, message, title) {
		this.buffer.push({type, message, title, timestamp: DateTime.now()})
		this.messages.set(this.buffer.toArray())
	}

	warning(message, title = undefined, options = {}) {
		this.#saveMessage(Warning, message, title)
		Toastr.warning(message, title, options)
	}

	success(message, title = undefined, options = {}) {
		this.#saveMessage(Success, message, title)
		Toastr.success(message, title, options)
	}

	error(message, title = undefined, options = {}) {
		this.#saveMessage(Error, message, title)
		Toastr.error(message, title, options)
	}
}

export default new NotificationProvider()
