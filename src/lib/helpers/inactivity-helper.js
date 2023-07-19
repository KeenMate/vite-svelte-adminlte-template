import throttle from "lodash/throttle"

const InactivityEventsThrottle = 1000

window.inactivityTimer = null

export default function (inactivityTimeout) {
	if (import.meta.env.DEV)
		return

	const resetTimerThrottled = throttle(() => resetTimer(inactivityTimeout), InactivityEventsThrottle)

	[
		"mousemove",
		"keydown"
	].forEach(event => {
		window.addEventListener(event, () => {
			resetTimerThrottled()
		})
	})

	resetTimer(inactivityTimeout)
}

function resetTimer(timeout) {
	if (window.inactivityTimer)
		clearTimeout(window.inactivityTimer)

	window.inactivityTimer = setTimeout(() => {
		window.dispatchEvent(new UserInactiveEvent())

	}, timeout)
}

class UserInactiveEvent extends Event {
	constructor() {
		super("user-inactive")
	}
}
