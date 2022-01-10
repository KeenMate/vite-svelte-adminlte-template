import {writable, get} from "svelte/store"
import socket from "./index"

export class Channel {

	constructor(topic, params = {}) {
		this.channel = writable(null)

		this.unsubscribeSocket = socket.subscribe((socket) => this.init(socket, topic, params))
	}

	/**
	 * Called internally
	 * @param socket
	 * @param topic
	 * @param params
	 */
	init(socket, topic, params) {
		// TODO await socket somehow
		if (!socket) {
			console.log("no socket")
			return
		}

		let channel = get(this.channel)
		if (channel) {
			channel.leave()
		}

		const channelConnection = socket.channel(topic, params)

		// channelConnection.onError(() => {
		//	 console.error("Channel error: ", arguments)
		// })

		channelConnection.join()
			.receive("ok", () => {
				this.channel.set(channelConnection)
			})
			.receive("error", error => {
				console.error("Could not join channel", error)
			})
	}

	get() {
		return new Promise(resolve => {
			let channel = get(this.channel)
			if (channel) {
				resolve(channel)
				return
			}

			let unsubscribe = this.channel.subscribe(chan => {
				if (chan) {
					resolve(chan)
					unsubscribe()
				}
			})
		})
	}

	async subscribeHandler(event, handler) {
		let channel = await this.get()

		console.log("Subscribing handler for event", event)
		return channel.on(event, response => {
			console.log("Calling subscription handler for event", event)
			handler(response)
		})
	}

	async unsubscribeHandler(event, reference) {
		let channel = await this.get()

		channel.off(event, reference)
	}

	removeListeners() {
		if (this.unsubscribeSocket)
			this.unsubscribeSocket()
	}
}
