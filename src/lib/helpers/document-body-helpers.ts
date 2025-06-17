/**
 * For cases when you want to use (modal) component that does not need to be nested in App and would be limited by nesting as well
 * @type {HTMLDivElement}
 */
const BodyLevelContainer = document.createElement("div")
BodyLevelContainer.classList.add("body-level-container")
document.body.appendChild(BodyLevelContainer)

export function getNewBodyContainerChild() {
	const element = document.createElement("div")
	BodyLevelContainer.appendChild(element)
	return element
}

export {BodyLevelContainer}
