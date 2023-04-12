import {getConfig, setConfig} from "@keenmate/svelte-adminlte"

const custom = {
	ContactEmail: "example@keenmate.com"
}


export function getCustomConfig() {
	setConfig(custom)
	return getConfig()
}
