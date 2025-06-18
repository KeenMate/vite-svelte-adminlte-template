<script lang="ts">
	import {Config, Modal, TableCondensed, TableRowFullWidth} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import notification, {Error, Success, Warning} from "../providers/notification-provider.js"
	import NoDataRow from "$lib/components/common/table/NoDataRow.svelte"

	type Props = {}

	let {}: Props = $props()

	export function show() {
		return modelElement?.show()
	}

	export function hide() {
		return modelElement?.hide()
	}

	let modelElement = $state()
	let messages = notification.messages

	let dateTimeFormat = $derived($Config.DateTimeFormat)

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

<Modal bind:this={modelElement} xlarge>
	{#snippet header()}
		{$_("messageLog.labels.title")}

	{/snippet}

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
