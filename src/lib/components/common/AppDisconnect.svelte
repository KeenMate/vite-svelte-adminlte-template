<script lang="ts">
	import ConnectionClosedModal from "$lib/components/modals/ConnectionClosedModal.svelte"
	import Socket, {IsSocketConnected, SocketShouldDisconnect} from "$lib/providers/socket/index.js"
	import {get, writable, type Writable} from "svelte/store"
	import type {Socket as PhoenixSocket} from "phoenix"
	import {
		startLogSessionTimeoutInterval,
		stopLogSessionTimeoutInterval,
		UserContext
	} from "$lib/stores/authentication.js"
	import PresenceCheckModal from "$lib/components/modals/PresenceCheckModal.svelte"
	import {LogSessionTimeoutSessionKey, SessionTimeoutReducterSecondsSessionKey} from "$lib/constants/authentication.js"

	let showPresenceCheckModal: VoidFunction
	let hidePresenceCheckModal: VoidFunction
	let showConnectionClosedModal: VoidFunction
	let hideConnectionClosedModal: VoidFunction

	const sessionTimeoutId: Writable<NodeJS.Timeout | null> = writable(null)
	const presenceCheckTimeoutId: Writable<NodeJS.Timeout | null> = writable(null)

	$: $UserContext
		&& showPresenceCheckModal
		&& showConnectionClosedModal
		&& onSessionTimeoutChanged($UserContext.sessionTimeout)

	function onSessionTimeoutChanged(sessionTimeoutSeconds: number | null | undefined): void {
		if (!sessionTimeoutSeconds) {
			return
		}

		// dev purposes
		const timeoutShortener = localStorage.getItem(SessionTimeoutReducterSecondsSessionKey)
		if (timeoutShortener && !isNaN(timeoutShortener as any)) {
			sessionTimeoutSeconds = sessionTimeoutSeconds - Number(timeoutShortener)
		}

		const nowUnixSeconds = Math.round(new Date().getTime() / 1000)
		const sessionTimeoutSecondsDiff: number | null | undefined = sessionTimeoutSeconds && (sessionTimeoutSeconds - nowUnixSeconds)

		console.log("On Session timeout changed", {nowUnixSeconds, sessionTimeout: sessionTimeoutSeconds, diff: sessionTimeoutSeconds - nowUnixSeconds})
		if (sessionTimeoutSecondsDiff > 0) {
			maybeClearTimeoutInterval(sessionTimeoutId)

			setDisconnectTimeout(sessionTimeoutSecondsDiff)

			const presenceCheckTimeoutSeconds = sessionTimeoutSecondsDiff - 120
			if (presenceCheckTimeoutSeconds > 0) {
				maybeClearTimeoutInterval(presenceCheckTimeoutId)
				setPresenceCheckTimeout(presenceCheckTimeoutSeconds)
			} else {
				showPresenceCheckModal()
			}
		} else {
			onSessionTimedOut()
		}

		// for debugging purposes
		const logSessionTimeoutConfig = localStorage.getItem(LogSessionTimeoutSessionKey)
		if (logSessionTimeoutConfig) {
			startLogSessionTimeoutInterval(Number(logSessionTimeoutConfig))
		}
	}

	function setPresenceCheckTimeout(timeoutSeconds: number) {
		presenceCheckTimeoutId.set(
			setTimeout(() => {
				presenceCheckTimeoutId.set(null)
				console.log("presence check timed out", timeoutSeconds, get(IsSocketConnected))
				showPresenceCheckModal()
			}, timeoutSeconds * 1000)
		)
	}

	function setDisconnectTimeout(timeoutSeconds: number) {
		console.log("disconnect time out set after ", timeoutSeconds, get(IsSocketConnected))
		sessionTimeoutId.set(
			setTimeout(() => {
				sessionTimeoutId.set(null)
				console.log("disconnect timed out", timeoutSeconds, get(IsSocketConnected))
				stopLogSessionTimeoutInterval()
				onSessionTimedOut()
			}, timeoutSeconds * 1000)
		)
	}

	function onSessionTimedOut() {
		if (!$Socket) {
			return
		}

		$Socket.disconnect(() => {
			// console.log("Socket disconnected", sessionTimeoutSeconds)
			SocketShouldDisconnect.set(true)
		})
		hidePresenceCheckModal?.()
		showConnectionClosedModal?.()
	}

	function onSignedIn() {
		hidePresenceCheckModal()
		hideConnectionClosedModal()
	}

	function maybeClearTimeoutInterval(intervalStore: Writable<NodeJS.Timeout | null>) {
		let originalTimeoutId = get(intervalStore)
		if (originalTimeoutId) {
			clearTimeout(originalTimeoutId)
		}
	}
</script>

<PresenceCheckModal
	bind:showModal={showPresenceCheckModal}
	bind:hideModal={hidePresenceCheckModal}
	on:signedIn={onSignedIn}
/>
<ConnectionClosedModal
	bind:showModal={showConnectionClosedModal}
	bind:hideModal={hideConnectionClosedModal}
	on:signedIn={onSignedIn}
/>
