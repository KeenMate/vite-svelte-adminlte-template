import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import html from "@rollup/plugin-html"
import esbuild from "rollup-plugin-esbuild"
import postcss from "rollup-plugin-postcss"
import copy from "rollup-plugin-copy"
import livereload from "rollup-plugin-livereload"
import sveltePreprocess from "svelte-preprocess"
// import dotenv from "rollup-plugin-dotenv"
import json from "@rollup/plugin-json"
import template from "./html-template"

const production = process.env.NODE_ENV === "prod"

function serve() {
	let server

	function toExit() {
		if (server) server.kill(0)
	}

	return {
		writeBundle() {
			if (server) return
			server = require("child_process").spawn("npm", ["run", "start"], {
				stdio: ["ignore", "inherit", "inherit"],
				shell: true
			})

			process.on("SIGTERM", toExit)
			process.on("exit", toExit)
		}
	}
}

export default {
	input: "src/main.js",
	output: {
		sourcemap: !production,
		format: "iife",
		name: "app",
		dir: "public",
		inlineDynamicImports: true
	},
	plugins: [
		replace({
			values: {
				"process.env.APP_URL": "window.location.href",
				"process.env.BASE_HTML_TITLE": JSON.stringify(process.env.BASE_HTML_TITLE),
			}
		}),
		json(),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},
			preprocess: sveltePreprocess(),
			onwarn() {
			}
		}),
		postcss({
			extract: true
		}),

		resolve({
			browser: true,
			dedupe: ["svelte"]
		}),

		commonjs(),

		esbuild({
			minify: production,
			target: "es2015"
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
				{src: "node_modules/jquery-ui-dist/jquery-ui.min.css", dest: "./public/css"},
				{src: "node_modules/@fortawesome/fontawesome-free/webfonts", dest: "./public"},
				{src: "src/assets/static/**/*", dest: "./public"}
			]
		}),

		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload("public")
	],
	watch: {
		clearScreen: true
	}
}
