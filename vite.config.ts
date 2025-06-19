import {defineConfig} from "vite"
import {svelte} from "@sveltejs/vite-plugin-svelte"
// @ts-ignore
import {viteStaticCopy} from "vite-plugin-static-copy"
import {createHtmlPlugin} from "vite-plugin-html"
import path from "path"
import projectAliases from "./project-aliases.json" with {type: "json"}

const isProduction = process.env.NODE_ENV === "production"

console.log("IS PRODUCTION BUILD: ", isProduction)

const outRootDir = "__build"
const baseUrl = "/admin"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		viteStaticCopy({
			targets: [
				{src: "node_modules/jsoneditor/dist/img/jsoneditor-icons.svg", dest: "../images"},
				{src: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", dest: outRootDir + "/js"},
				{src: "node_modules/admin-lte/dist/js/adminlte.min.js", dest: outRootDir + "/js"},
				{src: "node_modules/jquery/dist/jquery.min.js", dest: "../js"},
				{src: "node_modules/jquery-ui-dist/jquery-ui.min.js", dest: "../js"},
				{src: "node_modules/jquery-ui-dist/jquery-ui.min.css", dest: "../css"},
				{src: "node_modules/@fortawesome/fontawesome-free/webfonts", dest: "../"},
				{src: "public/*", dest: "../"}
			]
		}),
		createHtmlPlugin({
			entry: "src/main.ts",
			minify: isProduction,
			inject: {
				data: {
					contextPlaceholders:
						(isProduction &&
							`<input id="user-context" type="hidden" value="{USER_CONTEXT}">
<input id="access-token" type="hidden" value="{ACCESS_TOKEN}">
<input id="system-environment" type="hidden" value="{SYSTEM_ENV}">`) ||
						""
				}
			}
		})
	],
	resolve: {
		alias: Object.entries(projectAliases)
			.map(([alias, aliasPath]) => {
				return {find: alias, replacement: path.join(__dirname, ...aliasPath)}
			})
	},
	optimizeDeps: {
		include: [
			"toastr",
			"inputmask",
			"jquery",
			"lodash",
			"tippy.js",
			"@keenmate/svelte-adminlte",
			"svelte-select"
		]
	},
	base: baseUrl,
	build: {
		// assetsDir: "../",
		outDir: outRootDir + "/admin",
		copyPublicDir: false
		// emptyOutDir: true,
		// rollupOptions: {
		// 	external: ["jquery"],
		// 	output: {
		// 		globals: {
		// 			"jquery": "$",
		// 			jQuery: "$"
		// 		},
		// 	}
		// }
	},
	css:          {
		preprocessorOptions: {
			scss: {
				additionalData: `
					@use 'sass:color';
					@import "~assets/css/variables.scss";`
			}
		}
	},
	experimental: {
		// to fix links in index.html that are served from shared place in the root of serve dir
		renderBuiltUrl(filename, {type}) {
			if (type === "public") {
				return "/" + filename
			} else {
				return baseUrl + "/" + filename
			}
		}
	}
})
