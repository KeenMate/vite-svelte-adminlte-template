import {get, writable} from "svelte/store"
import {Socket} from "phoenix"
import {Toastr} from "svelte-adminlte"

import {SocketPath} from "../../constants/urls"

const socket = writable(null)

export const socketConnected = writable(false)

export function initSocket() {
	const existing = get(socket)
	if (existing) {
		existing.disconnect()
	}

	console.log("Connecting to:", SocketPath)

	const socketInstance = new Socket(SocketPath)

	socketInstance.onClose(() => {
		Toastr.warning("Connection closed")
		socketConnected.set(false)
	})
	socketInstance.onOpen(() => {
		Toastr.success("Connection established")
		socketConnected.set(true)
	})
	socketInstance.onError(error => {
		console.error("Error occured in socket connection", ...arguments)
		if (error === "expired") {
			Toastr.warning("Session expired")
			redirectToLogin()
		} else
			Toastr.error("Error occured while communicating with server")
	})

	console.log("Connecting to socket")
	socketInstance.connect()

	socket.set(socketInstance)

	return socketInstance
}

export default socket
