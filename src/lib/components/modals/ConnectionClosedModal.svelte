<script lang="ts">
	import {LteButton, Modal, ModalCloseButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import {loginUserAsync} from "$lib/authentication/index.js"
	import {createEventDispatcher} from "svelte"

	const dispatch = createEventDispatcher()

	let show: VoidFunction, hide: VoidFunction

	export {
		show as showModal,
		hide as hideModal
	}

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
		<svelte:fragment slot="header">
			{$_("common.headers.connectionClosed")}
		</svelte:fragment>

		<p>
			{@html $_("common.messages.connectionClosed")}
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
