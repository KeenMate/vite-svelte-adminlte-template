import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
// import {sveltePreprocess} from "svelte-preprocess"
// import projectAliases from "./project-aliases.json" with {type: "json"}
// import path from "path"

export default {
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess()
	// preprocess: sveltePreprocess({
	// 	scss: {
	// 		importer: [
	// 			url => {
	// 				for (const [alias, aliasPath] of Object.entries(projectAliases)) {
	// 					if (url.indexOf(alias) === 0) {
	// 						return {
	// 							file: url.replace(alias, path.join(process.cwd(), ...aliasPath))
	// 						}
	// 					}
	// 				}
	// 				return null
	// 			}
	// 		],
	// 		prependData: `
	// 			@use 'sass:color';
	// 			@import "./src/assets/css/variables.scss";`
	// 	}
	// })
}
