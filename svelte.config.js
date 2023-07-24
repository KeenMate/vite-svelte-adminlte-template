import sveltePreprocess from "svelte-preprocess"

export default {
	// svelte options
	extensions: [".svelte"],
	compilerOptions: {},
	preprocess: [sveltePreprocess()],
	onwarn: (warning, handler) => {},
	// plugin options
	vitePlugin: {
		exclude: [],
		// experimental options
		experimental: {}
	}
}
