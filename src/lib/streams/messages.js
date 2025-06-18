import {Subject} from "rxjs"

class Messages {
	constructor() {
		this.messagesSubject = new Subject()
	}

	nextMessage(type, msg) {
		this.messagesSubject.next({
			type,
			msg
		})
	}

	get() {
		return this.messagesSubject
	}
}

let messages               = new Messages()
// @ts-ignore
window.NotificationManager = messages

export default messages
