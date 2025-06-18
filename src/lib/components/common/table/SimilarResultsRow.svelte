<script lang="ts">
	import {TableRowFullWidth} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	let {searchText} = $props()
</script>

<TableRowFullWidth>
	<span class="d-block text-center font-italic h6 my-2">
		{$_("common.messages.similarResults", {values: {searchText}})}
	</span>
</TableRowFullWidth>
