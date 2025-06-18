<script lang="ts">
	import {LteButton, Modal, ModalCloseButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import {loginUserAsync} from "$lib/authentication"
	import {createEventDispatcher} from "svelte"

	const dispatch = createEventDispatcher()

	let {showModal: show = $bindable(), hideModal: hide = $bindable()} = $props()


	async function onRefreshServerConnection() {
		await loginUserAsync()

		dispatch("signedIn")
	}
</script>

<Modal
	bind:hide
	bind:show
	center
	color="warning"
>
	{#snippet header()}

		{$_("common.headers.presenceCheck")}

	{/snippet}

	<p>
		{@html $_("common.messages.presenceCheck")}
	</p>

	{#snippet actions()}

		<ModalCloseButton>
			{$_("common.buttons.close")}
		</ModalCloseButton>
		<LteButton color="primary" on:click={onRefreshServerConnection}>
			{$_("common.labels.reconnect")}
		</LteButton>

	{/snippet}
</Modal>
