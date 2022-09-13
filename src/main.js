import "./assets/css/main.scss"
import "bootstrap/dist/js/bootstrap.min"
import "admin-lte/dist/js/adminlte"
import "./lib/helpers/object-helpers.js"

import App from "./App.svelte"

const app = new App({
	target: document.getElementById("app")
})

export default app
