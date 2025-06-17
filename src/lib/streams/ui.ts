import {derived, readable} from "svelte/store"

export const KeyPressed = readable<{ev: KeyboardEvent, type: "up" | "down"} | null>(null, (set) => {
	// console.log("Calling observable init function")

	const keydownListener = (ev: KeyboardEvent) => {
		// console.log("KeyPressed down event", {ev})
		set({ev, type: "down"})
	}
	window.addEventListener("keydown", keydownListener)
	const keyupListener = (ev: KeyboardEvent) => set({ev, type: "up"})
	window.addEventListener("keyup", keyupListener)

	return () => {
		window.removeEventListener("keydown", keydownListener)
		window.removeEventListener("keyup", keyupListener)
	}
})

export const IsShiftKeyHeld = derived<typeof KeyPressed, boolean>(KeyPressed, (value, set) => {
	if (!value) {
		set(false)
		return
	}

	// console.log("Shift key pressed", value.ev.key)
	if (value.ev.key !== "Shift") {
		return
	}

	set(value.ev.shiftKey)
})

export const IsCtrlKeyHeld = derived<typeof KeyPressed, boolean>(KeyPressed, (value, set) => {
	if (!value) {
		set(false)
		return
	}

	// console.log("Ctrl key pressed", value.ev.key)
	// console.log("Ctrl is pressed", value.ev.ctrlKey)
	if (value.ev.key !== "Control") {
		return
	}


	set(value.ev.ctrlKey)
})
