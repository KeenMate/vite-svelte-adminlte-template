import path from "path"
import {defineConfig} from "vite"
import {svelte} from "@sveltejs/vite-plugin-svelte"
import sveltePreprocess from "svelte-preprocess"
import copy from "rollup-plugin-copy"
import {createHtmlPlugin} from "vite-plugin-html"

const isProduction = process.env.NODE_ENV === "production"

console.log("IS PRODUCTION BUILD: ", isProduction)

const outRootDir = isProduction ? "__build" : "public"

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
    alias: [
      // {find: "~bootstrap", replacement: "bootstrap"},
      {find: "#", replacement: path.join(__dirname, "node_modules")},
      {find: "$lib", replacement: path.join(__dirname, "src", "lib")},
      {find: "~assets", replacement: path.join(__dirname, "src", "assets")}
    ]
  },
  optimizeDeps: {
    include: ["toastr", "inputmask", "jquery"]
  },

  // publicDir: false, // !isProduction && outRootDir,
  base: (isProduction && "/admin/") || "/",
  // server: {
  // 	host: !isProduction && "localhost" || "",
  // 	port: 5173,
  // 	strictPort: true
  // },

  build: {
    // assetsDir: "../",
    outDir: outRootDir + "/admin"
    // emptyOutDir: true
  }
})
