<script lang="ts">
	import {TableRowFullWidth} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
</script>

<TableRowFullWidth>
	<span class="d-block text-center text-bold h6 my-2">
		{$_("common.messages.noExactMatches")}
	</span>
</TableRowFullWidth>
