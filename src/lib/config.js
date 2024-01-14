import {Config} from "@keenmate/svelte-adminlte"

const custom = {
	ContactEmail: "example@keenmate.com",
	DateTimeFormat: "DD.MM.YYYY HH:mm:ss"
}

Config.update(config => ({
	...config,
	...custom
}))