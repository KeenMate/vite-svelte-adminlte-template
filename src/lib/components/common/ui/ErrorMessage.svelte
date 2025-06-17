<script lang="ts">
	import {DangerAlert} from "@keenmate/svelte-adminlte"
</script>

<DangerAlert closeable on:close>
	<slot />
</DangerAlert>
