import "./assets/css/main.scss"

import "bootstrap/dist/js/bootstrap.bundle.min"
import "admin-lte/dist/js/adminlte"

import App from "./App.svelte"

const app = new App({
	target: document.getElementById("app")
})

export default app
