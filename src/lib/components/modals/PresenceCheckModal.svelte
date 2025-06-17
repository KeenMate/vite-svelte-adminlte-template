<script lang="ts">
	import {LteButton, Modal, ModalCloseButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import {loginUserAsync} from "$lib/authentication"
	import {createEventDispatcher} from "svelte"

	const dispatch = createEventDispatcher()

	let show, hide

	export {
		show as showModal,
		hide as hideModal
	}

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
	<svelte:fragment slot="header">
		{$_("common.headers.presenceCheck")}
	</svelte:fragment>

	<p>
		{@html $_("common.messages.presenceCheck")}
	</p>

	<svelte:fragment slot="actions">
		<ModalCloseButton>
			{$_("common.buttons.close")}
		</ModalCloseButton>
		<LteButton color="primary" on:click={onRefreshServerConnection}>
			{$_("common.labels.reconnect")}
		</LteButton>
	</svelte:fragment>
</Modal>
