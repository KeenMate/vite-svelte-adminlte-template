<script>
	import notification, {Success, Warning, Error} from "../providers/notification-provider"
	import {getConfig} from "svelte-adminlte"
	import {DateTime} from "luxon"

	import {Modal, Card, TableCondensed} from "svelte-adminlte"

	export let show
	export let hide

	let messages = notification.messages
	let {DateTimeFormat} = getConfig()

	function color(messageType) {
		if (messageType === Success) {
			return "text-success"
		} else if (messageType === Warning) {
			return "text-warning"
		} else if (messageType === Error) {
			return "text-danger"
		}
	}
</script>

<Modal xlarge bind:show bind:hide>
	<svelte:fragment slot="header">Message log</svelte:fragment>

	<TableCondensed>
		<tr>
			<td>Timestamp</td>
			<td>Type</td>
			<td>Title</td>
			<td>Message</td>
		</tr>

		{#each $messages as message}
			<tr>
				<td>{message.timestamp.toFormat(DateTimeFormat)}</td>
				<td class={color(message.type)}>{message.type}</td>
				<td>{message.title}</td>
				<td>{message.message}</td>
			</tr>
		{/each}
	</TableCondensed>
</Modal>
