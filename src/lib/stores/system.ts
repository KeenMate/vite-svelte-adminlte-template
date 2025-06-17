import {writable} from "svelte/store"
import type {SystemEnvironmentType} from "$lib/types/index.js"

export const SystemEnvironment = writable(getSystemEnvironmentFromHtml())

function getSystemEnvironmentFromHtml(): SystemEnvironmentType {
	const value = document.getElementById("system-environment")?.value

	return (value && JSON.parse(value)) || null
}
