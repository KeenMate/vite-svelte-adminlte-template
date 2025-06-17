<script lang="ts">
	import {Config, Modal, TableCondensed, TableRowFullWidth} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import notification, {Error, Success, Warning} from "../providers/notification-provider.js"
	import NoDataRow from "$lib/components/common/table/NoDataRow.svelte"

	export let show = null
	export let hide = null

	let messages = notification.messages

	$: dateTimeFormat = $Config.DateTimeFormat

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

<Modal bind:show bind:hide xlarge>
	<svelte:fragment slot="header"
	>{$_("messageLog.labels.title")}
	</svelte:fragment>

	<TableCondensed class="table-hover center-align-cells">
		<tr>
			<td>{$_("common.tableColumns.created")}</td>
			<td>{$_("common.tableColumns.type")}</td>
			<td>{$_("common.tableColumns.title")}</td>
			<td>{$_("messageLog.tableColumns.message")}</td>
		</tr>

		{#each $messages as message}
			<tr>
				<td>{message.timestamp.toFormat(dateTimeFormat)}</td>
				<td>{message.type ?? ""}</td>
				<td>{message.title ?? ""}</td>
				<td class={color(message.level)}>{message.message}</td>
			</tr>
		{:else}
			<NoDataRow />
		{/each}
	</TableCondensed>
</Modal>
