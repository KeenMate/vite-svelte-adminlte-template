<script lang="ts">
	import {DangerAlert} from "@keenmate/svelte-adminlte"

	type Props = {
		children?: import("svelte").Snippet;
	}

	let {children}: Props = $props()
</script>

<DangerAlert closeable on:close>
	{@render children?.()}
</DangerAlert>
