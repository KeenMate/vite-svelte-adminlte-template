<script lang="ts">
	import {LteButton, Modal, ModalCloseButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import {loginUserAsync} from "$lib/authentication/index.js"
	import {createEventDispatcher} from "svelte"

	const dispatch = createEventDispatcher()

	type Props = {
		showModal: VoidFunction;
		hideModal: VoidFunction;
	}

	let {showModal: show = $bindable(), hideModal: hide = $bindable()}: Props = $props()

	async function onRefreshServerConnection() {
		await loginUserAsync()

		dispatch("signedIn")
	}
</script>

<div class="connection-closed-modal">
	<Modal
		bind:show
		bind:hide
		color="danger"
		class="connection-closed"
		center
	>
		{#snippet header()}
			{$_("common.headers.connectionClosed")}
		{/snippet}

		<p>
			{@html $_("common.messages.connectionClosed")}
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
</div>

<!--<style lang="scss">-->
<!--	:global {-->
<!--		.connection-closed-modal {-->
<!--			.modal {-->
<!--				z-index: 9999;-->
<!--			}-->
<!--		}-->
<!--	}-->
<!--</style>-->
