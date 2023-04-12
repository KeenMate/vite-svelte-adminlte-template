<script>
	import {getConfig, TableRowFullWidth, Modal, TableCondensed} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import notification, {Success, Warning, Error} from "../providers/notification-provider"

	export let show = null
	export let hide = null

	let messages = notification.messages
	let {DateTimeFormat} = getConfig()

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
	<svelte:fragment slot="header"
		>{$_("messageLog.labels.title")}
	</svelte:fragment>

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
				<td class={color(message.level)}>{message.message}</td>
			</tr>
		{:else}
			<TableRowFullWidth class="no-data">
				{$_("common.warnings.noData")}
			</TableRowFullWidth>
		{/each}
	</TableCondensed>
</Modal>
