import {get, type Writable, writable} from "svelte/store"
import {Toastr} from "@keenmate/svelte-adminlte"
import {Channel as PhoenixChannel, Socket as PhoenixSocket} from "phoenix"
import throttle from "lodash/throttle.js"
import {SocketUrl} from "$lib/constants/urls.js"
import {ErrorToastrTimeout, WarningToastrTimeout} from "$lib/constants/toastr.js"
import {Channel, pushSocketMessageAsync} from "@keenmate/js-common-helpers/socket/channel.js"
import {getChannelTimeout, pushChannelTimeout} from "$lib/constants/socket.js"
import {_} from "svelte-i18n"

const socketToastDisconnectedThrottled = throttle(function(type: any, ...rest: any[]) {
	Toastr[type].apply(Toastr, rest)
}, 60000)

const socketToastThrottled = throttle(function(type: any, ...rest: any[]) {
	Toastr[type].apply(Toastr, rest)
}, 10000)

const Socket: Writable<PhoenixSocket | null> = writable(null)

const IsSocketConnected = writable(false)
const SocketShouldDisconnect = writable(false)

async function getChannelTimeoutAsync(
	channel: Channel,
	timeout: number
): Promise<PhoenixChannel> {
	return new Promise((resolve, reject) => {
		setTimeout(() => reject("channel-timeout"), timeout)
		channel.getAsync().then(resolve).catch(reject)
	})
}

async function pushTimeoutAsync<TData>(
	channel: PhoenixChannel,
	event: string,
	payload: any,
	timeout: number
): Promise<TData> {
	return new Promise((resolve, reject) => {
		if (timeout > 0) {
			setTimeout(() => reject("push-timeout"), timeout)
		}
		pushSocketMessageAsync<TData>(channel, event, payload)
			.then(resolve)
			.catch(reject)
	})
}

export function initSocket(token: string) {
	let socketInstance = get(Socket)

	if (!socketInstance) {
		socketInstance = new PhoenixSocket(SocketUrl, {
			reconnectAfterMs(tries) {
				const durations = [100, 1000, 10000]

				if (tries > durations.length) {
					SocketShouldDisconnect.set(true)

					return Infinity
				} else {
					return durations[(tries - 1) % durations.length] || 5000
				}
			}
		})

		socketInstance.onClose(() => {
			IsSocketConnected.set(false)

			if (get(SocketShouldDisconnect)) {
				socketInstance.disconnect()
				SocketShouldDisconnect.set(false)
			} else {
				socketToastDisconnectedThrottled("warning", get(_)("common.notifications.socketConnectionClosed"), null, {
					timeOut: WarningToastrTimeout
				})
			}
		})
		socketInstance.onOpen(() => {
			Toastr.success(get(_)("common.notifications.socketConnectionEstablished"))
			IsSocketConnected.set(true)
			SocketShouldDisconnect.set(false)
			Socket.set(socketInstance)
		})
		socketInstance.onError(error => {
			if (!get(IsSocketConnected)) {
				return
			}

			console.error("Error occurred in socket connection", error)
			if (error === "expired") {
				Toastr.warning(get(_)("common.notifications.socketSessionExpired"), null, {timeOut: WarningToastrTimeout})
				// redirectToLogin()
			} else {
				socketToastThrottled(
					"error",
					get(_)("common.notifications.socketServerCommunicationError"),
					null,
					{timeOut: ErrorToastrTimeout}
				)
			}
		})
	} else if (socketInstance.isConnected()) {
		socketInstance.disconnect()
	}

	socketInstance.connect({
		token
	})

	return socketInstance
}

/**
 * @param channel
 * @param event
 * @param payload
 * @param pushTimeout - timeout for push, if it is <= 0 then it is ignored
 * @param channelTimeout
 */
export async function savePushAsync<TResponse>(
	channel: Channel,
	event: string,
	payload: any,
	pushTimeout: number = pushChannelTimeout,
	channelTimeout: number = getChannelTimeout
): Promise<TResponse> {
	try {
		const startTime = Date.now()
		const c = await getChannelTimeoutAsync(channel, channelTimeout)

		const response = await pushTimeoutAsync<TResponse>(
			c,
			event,
			payload,
			pushTimeout
		)

		const endTime = Date.now()

		console.debug(
			`push ${c.topic}.${event} (${endTime - startTime}ms)`,
			payload,
			response
		)

		return response
	} catch (e) {
		if (e === "channel-timeout") {
			console.error(
				`timeout while waiting for channel ${channel.topic} before sending ${event}, make sure you are connectiong to that channel`
			)
			throw e
		}

		if (e === "push-timeout") {
			console.error(`timeout while waiting for push ${channel.topic}.${event}`)
			throw e
		}

		console.error(`error while pushing ${channel.topic}.${event}`, e)
		throw e
	}
}

// /**
//  * @param channel
//  * @param event
//  * @param payload
//  * @param pushTimeout - timeout for push, if it is <= 0 then it is ignored
//  * @param channelTimeout
//  */
// export async function savePushAsync<TData>(
// 	channel: Channel,
// 	event: string,
// 	payload: any,
// 	pushTimeout: number = pushChannelTimeout,
// 	channelTimeout: number = getChannelTimeout
// ): Promise<TData> {
// 	const {data} = await savePushRawAsync<PushResponse<TData>>(channel,
// 		event,
// 		payload,
// 		pushTimeout,
// 		channelTimeout)
//
// 	return data
// }

export {
	IsSocketConnected,
	SocketShouldDisconnect
}

export default Socket
