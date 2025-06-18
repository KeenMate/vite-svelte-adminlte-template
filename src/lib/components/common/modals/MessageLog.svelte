<script lang="ts">
	import {Config, Modal, TableCondensed, TableRowFullWidth} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import NotificationProvider, {Success, Warning} from "$lib/providers/notification-provider"

	type Props = {
		show?: any;
		hide?: any;
	}

	let {show = $bindable(null), hide = $bindable(null)}: Props = $props()

	let messages       = NotificationProvider.messages
	let DateTimeFormat = $derived($Config.DateTimeFormat)

	function color(level) {
		if (level === Success) {
			return "text-success"
		} else if (level === Warning) {
			return "text-warning"
		} else if (level === Error) {
			return "text-danger"
		}
	}
</script>

<Modal xlarge bind:show bind:hide>
	{#snippet header()}
		{$_("messageLog.labels.title")}

	{/snippet}

	<TableCondensed class="center-align-cells">
		<tr>
			<td>{$_("common.tableColumns.created")}</td>
			<td>{$_("common.tableColumns.type")}</td>
			<td>{$_("common.tableColumns.title")}</td>
			<td>{$_("messageLog.tableColumns.message")}</td>
		</tr>

		{#each $messages as message}
			<tr>
				<td>{message.timestamp.toFormat(DateTimeFormat)}</td>
				<td>{message.type ?? ""}</td>
				<td>{message.title ?? ""}</td>
				<td class={color(message.type)}>{message.message}</td>
			</tr>
		{:else}
			<TableRowFullWidth class="no-data">
				{$_("common.warnings.noData")}
			</TableRowFullWidth>
		{/each}
	</TableCondensed>
</Modal>
