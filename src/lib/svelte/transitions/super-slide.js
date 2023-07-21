import {cubicOut} from "svelte/easing"

/**
 * @param node
 * @param {{ targetSize: string?, orientation: "top" | "right" | "bottom" | "left" | null, delay?: number, duration?: number, easing?: (t: number) => number | cubicOut}} params
 */
export default function (node, params) {
	// Params sanitization
	const delay = params.delay || 0
	const duration = params.duration || 400
	const easing = params.easing || cubicOut
	const orientation = params.orientation || getOrientationBasedOnPage()

	const targetSize = params.targetSize
	const translateAxis = getTranslateAxis(orientation)
	const translateSign = getTranslateSign(orientation)

	console.log("orientation", orientation)
	console.log("translateAxis", translateAxis)
	console.log("translateSign", translateSign)
	return {
		delay,
		duration,
		easing,
		css: (_t, u) => {
			return `
				transform: translate${translateAxis}(calc(${translateSign}${targetSize} * ${u}));
			`
		}
	}
}

function getTranslateSign(orientation) {
	return orientation === "left" || orientation === "top"
		? "-"
		: ""
}

function getTranslateAxis(orientation) {
	switch (orientation) {
		case "left":
		case "right":
			return "X"
		case "top":
		case "bottom":
			return "Y"
		default:
			throwInvalidOrientationError(orientation)
	}
}

function getOrientationBasedOnPage() {
	const style = getComputedStyle(document.body)

	return style.direction === "ltr" ? "right" : "left"
}

function throwInvalidOrientationError(orientation) {
	throw new Error(`Invalid orientation (${orientation}) for super-slide transition`)
}
