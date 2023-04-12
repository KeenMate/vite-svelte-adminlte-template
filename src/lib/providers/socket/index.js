import {get, writable} from "svelte/store"
import {Toastr} from "@keenmate/svelte-adminlte"
import {Socket} from "phoenix"
import throttle from "lodash/throttle"

import {SocketUrl} from "$lib/constants/urls"
import {ErrorToastrTimeout, WarningToastrTimeout} from "$lib/constants/toastr"

const socket = writable(null)

export const SocketConnected = writable(false)
export const SocketReconnectRetriesFailed = writable(false)

export function initSocket(token) {
	const existing = get(socket)
	if (existing) {
		existing.disconnect()
	}

	const socketInstance = new Socket(SocketUrl, {
		reconnectAfterMs(tries) {
			const durations = [100, 1000, 10000]

			if (tries > durations.length) {
				SocketReconnectRetriesFailed.set(true)

				return Infinity
			} else

				return durations[(tries - 1) % durations.length] || 5000
		},
		params: {
			token
		}
	})

	socketInstance.onClose(() => {
		socketToastDisconnectedThrottled("warning", "Connection closed", null, {timeOut: WarningToastrTimeout})
		SocketConnected.set(false)

		if (get(SocketReconnectRetriesFailed)) {
			socketInstance.disconnect()
		}
	})
	socketInstance.onOpen(() => {
		// Toastr.success("Connection established")
		SocketConnected.set(true)
		SocketReconnectRetriesFailed.set(false)
		socket.set(socketInstance)
	})
	socketInstance.onError(error => {
		if (!get(SocketConnected))
			return

		console.error("Error occured in socket connection", error)
		if (error === "expired") {
			Toastr.warning("Session expired", null, {timeOut: WarningToastrTimeout})
			// redirectToLogin()
		} else
			socketToastThrottled("error", "Error occured while communicating with server", null, {timeOut: ErrorToastrTimeout})
	})

	socketInstance.connect()

	return socketInstance
}

const socketToastDisconnectedThrottled = throttle(function (type, ...rest) {
	Toastr[type].apply(Toastr, rest)
}, 60000)

const socketToastThrottled = throttle(function (type, ...rest) {
	Toastr[type].apply(Toastr, rest)
}, 10000)

export default socket
