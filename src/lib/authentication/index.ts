import BaseProvider from "$lib/providers/base-provider.js"
import {loadUserContextAsync} from "$lib/stores/authentication.js"
import {checkPeriodically} from "@keenmate/js-common-helpers/helpers/intervals.js"
import Socket, {SocketShouldDisconnect} from "$lib/providers/socket/index.js"
import {get} from "svelte/store"

export async function loginUserAsync(): Promise<void> {
	const handle = BaseProvider.loginPopup("/popup-logged-in")

	await checkPeriodically(() => handle.closed, 1000)

	const socket = get(Socket)
	if (socket?.isConnected()) {
		return new Promise(resolve => {
			SocketShouldDisconnect.set(true)
			socket.disconnect(() => {
				resolve(loadUserContextAsync() as any)
			})

		})
	} else {
		await loadUserContextAsync()
	}

}
