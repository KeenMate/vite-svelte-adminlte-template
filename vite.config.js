import {defineConfig} from "vite"
import {svelte} from "@sveltejs/vite-plugin-svelte"
// import replace from "@rollup/plugin-replace"
import sveltePreprocess from "svelte-preprocess"
import html from "@rollup/plugin-html"
import copy from "rollup-plugin-copy"
import template from "./html-template.js"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		// replace({
		// 	preventAssignment: true,
		// 	values: {
		// 		"process.env.APP_URL": "window.location.href",
		// 		"process.env.BASE_HTML_TITLE": JSON.stringify(process.env.BASE_HTML_TITLE)
		// 	}
		// }),
		svelte({
			preprocess: sveltePreprocess()
		}),

		html({
			title: process.env.BASE_HTML_TITLE,
			template
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
				{src: "src/locale/*.json", dest: "public/locales"},
				{src: "src/assets/static/*", dest: "./public"}
			]
		})
	]
})
