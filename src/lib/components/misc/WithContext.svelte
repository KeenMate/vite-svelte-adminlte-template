<script lang="ts">
	import {setContext} from "svelte"

	type Props = {
		key: string | symbol;
		children?: import("svelte").Snippet;
		[key: string]: any
	}

	let {key, children = undefined, ...rest}: Props = $props()

	setContext(key, rest)
</script>

{@render children?.()}
