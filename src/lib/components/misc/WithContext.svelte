<script lang="ts">
	import {setContext} from "svelte"

	export let key: string | symbol

	setContext(key, $$restProps)
</script>

<slot />
