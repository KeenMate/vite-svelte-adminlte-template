<script lang="ts">
	import {_} from "svelte-i18n"
	import {IsAuthenticated} from "$lib/stores/authentication.js"
	import {SystemEnvironment} from "$lib/stores/system.js"
</script>

<div class="app-versions">
	{#if $IsAuthenticated}
		<div class="d-flex align-items-center gap-2">
			<span>
				{$_("common.labels.appVersion")}: <strong>{$SystemEnvironment?.versions.appVersion || "-"}</strong>
			</span>
			<span>
				{$_("common.labels.dbVersion")}: <strong>{$SystemEnvironment?.versions.dbVersion || "-"}</strong>
			</span>
		</div>
	{/if}
</div>
