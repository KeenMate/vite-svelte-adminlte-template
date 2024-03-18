<script lang="ts">
	import ModalRejectedError from "$lib/types/modal-rejected-error"
	import {createEventDispatcher} from "svelte"
	import {Modal, ModalCloseButton, DeleteButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	const dispatch = createEventDispatcher()

	export function showModal(dd: any) {
		deleteData = dd
		show()

		return new Promise((resolve, reject) => {
			resolveModal = resolve
			rejectModal = reject
		})
	}

	export function hideModal() {
		hide()
	}

	let jModalElement: Modal
	let show: () => void, hide: () => void
	let deleteData: any

	let resolveModal: (data: any) => void, rejectModal: (reason: any) => void

	$: jModalElement && jModalElement.off("hidden.bs.modal", doReject)
	$: jModalElement && jModalElement.on("hidden.bs.modal", doReject)

	function doReject() {
		rejectModal && rejectModal(new ModalRejectedError())
	}

	function doConfirm() {
		resolveModal(deleteData)
		hide()
		dispatch("delete", deleteData)
	}
</script>

<Modal bind:jModalElement bind:show bind:hide>
	<svelte:fragment slot="header">
		{$_("common.labels.deleteConfirmation")}
	</svelte:fragment>

	<slot data={deleteData} />

	<svelte:fragment slot="actions">
		<ModalCloseButton>
			{$_("common.buttons.cancel")}
		</ModalCloseButton>

		<DeleteButton small on:click={doConfirm}>
			{$_("common.buttons.delete")}
		</DeleteButton>
	</svelte:fragment>
</Modal>
