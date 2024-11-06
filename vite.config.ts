import path from "path"
import {defineConfig} from "vite"
import {svelte} from "@sveltejs/vite-plugin-svelte"
import sveltePreprocess from "svelte-preprocess"
import copy from "rollup-plugin-copy"
import {createHtmlPlugin} from "vite-plugin-html"
import projectAliases from "./project-aliases.json" with { type: "json" }

const isProduction = process.env.NODE_ENV === "production"

console.log("IS PRODUCTION BUILD: ", isProduction)

const outRootDir = "__build"
const baseUrl = "/admin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess()
    }),
    // copy files that are not frequently modified (for other assets create separate copy plugin)
    copy({
      targets: [
        {
          src: "node_modules/jsoneditor/dist/img/jsoneditor-icons.svg",
          dest: outRootDir + "/images"
        },
        {
          src: "node_modules/jquery/dist/jquery.min.js",
          dest: outRootDir + "/js"
        },
        {
          src: "node_modules/jquery-ui-dist/jquery-ui.min.js",
          dest: outRootDir + "/js"
        },
        {
          src: "node_modules/jquery-ui-dist/jquery-ui.min.css",
          dest: outRootDir + "/css"
        },
        {
          src: "node_modules/@fortawesome/fontawesome-free/webfonts",
          dest: outRootDir
        }
      ]
    }) as any, // this is needed because of a error in vite-plugin-copy type

    // this config will copy assets into the root of build output (given that the build output is /admin)
		// viteStaticCopy({
		// 	targets: [
		// 		{src: "node_modules/jsoneditor/dist/img/jsoneditor-icons.svg", dest: "../images"},
		// 		// {src: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", dest: outRootDir + "/js"},
		// 		// {src: "node_modules/admin-lte/dist/js/adminlte.min.js", dest: outRootDir + "/js"},
		// 		{src: "node_modules/jquery/dist/jquery.min", dest: "../js"},
		// 		{src: "node_modules/jquery-ui-dist/jquery-ui.min.js", dest: "../js"},
		// 		{src: "node_modules/jquery-ui-dist/jquery-ui.min.css", dest: "../css"},
		// 		{src: "node_modules/@fortawesome/fontawesome-free/webfonts", dest: "../"},
		// 		{src: "public/*", dest: "../"}
		// 	]
		// }),

    createHtmlPlugin({
      entry: "src/main.js",
      minify: isProduction,
      inject: {
        data: {
          contextPlaceholders:
            (isProduction &&
              `<input id="languages" type="hidden" value="{LANGS}">
<input id="current-user" type="hidden" value="{CURRENT_USER}">
<input id="socket-token" type="hidden" value="{SOCKET_TOKEN}">
<input id="session-timeout" type="hidden" value="{SESSION_TIMEOUT}">
<input id="current-locale" type="hidden" value="{CURRENT_LOCALE}">`) ||
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
    include: ["toastr", "inputmask", "jquery"]
  },

  // publicDir: false, // !isProduction && outRootDir,
  base: baseUrl,
  // server: {
  // 	host: !isProduction && "localhost" || "",
  // 	port: 5173,
  // 	strictPort: true
  // },

  build: {
    // assetsDir: "../",
    outDir: outRootDir + "/admin",
		// copyPublicDir: false
    // emptyOutDir: true
  },
  // working (should be - it is experimental..)
	// experimental: {
	// 	// to fix links in index.html that are served from shared place in the root of serve dir
	// 	renderBuiltUrl(filename, {hostId, hostType, type}) {
	// 		if (type === "public") {
	// 			return "/" + filename
	// 		} else {
	// 			return baseUrl + "/" + filename
	// 		}
	// 	}
	// }
})
