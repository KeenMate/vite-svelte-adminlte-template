import {defineConfig} from "vite"
import {svelte} from "@sveltejs/vite-plugin-svelte"
import sveltePreprocess from "svelte-preprocess"
import copy from "rollup-plugin-copy"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte({
			preprocess: sveltePreprocess()
		}),
		// copy files that are not frequently modified (for other assets create separate copy plugin)
		copy({
			copyOnce: true,
			targets: [
				{src: "node_modules/jsoneditor/dist/img/jsoneditor-icons.svg", dest: "./public/img"},
				{src: "node_modules/jquery/dist/jquery.min.js", dest: "./public/js"},
				{src: "node_modules/jquery-ui-dist/jquery-ui.min.js", dest: "./public/js"},
				{src: "node_modules/jquery-ui-dist/jquery-ui.min.css", dest: "./public/css"},
				{src: "node_modules/@fortawesome/fontawesome-free/webfonts", dest: "./public"},
				{src: "src/locale/*.json", dest: "public/locales"}
			]
		})
	],
	resolve: {
		alias: {
			'~bootstrap': 'bootstrap'
		}
	},
	optimizeDeps: {
		include: [
			"toastr",
			"inputmask",
			"jquery"
		]
	},
	publicDir: "./public"
})
