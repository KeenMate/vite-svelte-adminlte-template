import {getConfig, setConfig} from "@keenmate/svelte-adminlte"

const custom = {
	ContactEmail: "example@keenmate.com",
	DateTimeFormat: "DD.MM.YYYY HH:mm:ss"
}

export function getCustomConfig() {
	setConfig(custom)
	return getConfig()
}
