import {writable, get} from "svelte/store"
import socket from "./index"

export class Channel {
	handlers = []

	joining = false
	channelSubscribers = writable(0)

	constructor(topic, params = {}) {
		this.topic = topic
		this.channel = writable(null)

		this.unsubscribeSocket = socket.subscribe((socket) => this.socketChanged(socket, topic, params))
		this.unsubscribeChannelSubscribers = this.channelSubscribers.subscribe(subscribers => this.subscribersChanged(subscribers))
	}

	subscribersChanged(subscribers) {
		if (!subscribers) {
			this.leave()
			return
		}

		this.#joinChannel()
	}

	/**
	 * Called internally
	 * @param socket {Socket}
	 * @param topic
	 * @param params
	 */
	async socketChanged(socket, topic, params) {
		if (!socket) return

		await this.leave()

		let channel = socket.channel(topic, params)

		this.channel.set(channel)
	}

	join() {
		this.touchChannelSubscribers(1)
	}

	leave() {
		this.touchChannelSubscribers(-1)
	}

	#joinChannel() {
		if (this.joining || this.joined)
			return

		this.joining = true
		this.waitForChannel()
			.then(channel => {
				channel
					.join()
					.receive("ok", () => {
						console.debug("Channel joined", this.topic)
						this.joining = false
						this.joined = true
					})
					.receive("error", error => {
						console.error(`Could not join channel: ${this.topic}`, error)
						this.joining = false
						this.joined = true
					})
			})
	}

	async subscribeHandler(event, handler) {
		let channel = await this.waitForChannel()

		const handlerWrapper = function (response) {
			handler(response)
		}
		this.handlers.push([event, handlerWrapper])

		return channel.on(event, handlerWrapper)
	}

	async unsubscribeHandler(event, reference) {
		let channel = await this.waitForChannel()

		channel.off(event, reference)
	}

	async get() {
		const channel = await this.waitForChannel()
		await this.waitForChannelJoined()

		return channel
	}

	async waitForChannelJoined() {
		if (this.joined)
			return
		return new Promise(resolve => {
			var checkJoinedInt = setInterval(() => {
				if (!this.joined)
					return
				clearInterval(checkJoinedInt)
				resolve()
			}, 25)
		})
	}

	async waitForChannel() {
		let channel = get(this.channel)
		if (channel)
			return channel
		return new Promise(resolve => {
			var checkChannelInt = setInterval(() => {
				channel = get(this.channel)
				if (!channel)
					return
				clearInterval(checkChannelInt)
				resolve(channel)
			}, 25)
		})
	}

	touchChannelSubscribers(step) {
		this.channelSubscribers.update(x => {
			const res = x + step
			return res < 0
				? 0
				: res
		})

	}

	destroy() {
		if (this.unsubscribeChannelSubscribers)
			this.unsubscribeChannelSubscribers()

		return this.waitForChannel()
			.then(channel => {
				this.handlers.forEach(([event, handler]) => {
					channel.off(event, handler)
				})

				this.handlers = []

				return this.leave()
			})
			.then(() => {
				if (this.unsubscribeSocket)
					this.unsubscribeSocket()
			})
	}
}
