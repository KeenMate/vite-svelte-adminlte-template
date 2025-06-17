<script lang="ts" generics="T">
	import ModalRejectedError from "$lib/types/modal-rejected-error.js"
	import {createEventDispatcher} from "svelte"
	import {DeleteButton, Modal, ModalCloseButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	const dispatch = createEventDispatcher()

	export function showModal(dd: T) {
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

	let jModalElement: any
	let show: VoidFunction
	let hide: VoidFunction
	let deleteData: T

	let resolveModal: Function
	let rejectModal: Function

	$: jModalElement && jModalElement.off("hidden.bs.modal", doReject)
	$: jModalElement && jModalElement.on("hidden.bs.modal", doReject)

	function doReject() {
		rejectModal && rejectModal(new ModalRejectedError())
	}

	function doConfirm() {
		resolveModal(deleteData)
		dispatch("delete", deleteData)
	}
</script>

<Modal bind:jModalElement bind:show bind:hide>
	<svelte:fragment slot="header">
		{$_("common.labels.deleteConfirmation")}
	</svelte:fragment>

	<slot data={deleteData}></slot>

	<svelte:fragment slot="actions">
		<ModalCloseButton>
			{$_("common.buttons.close")}
		</ModalCloseButton>

		<DeleteButton small on:click={doConfirm}>
			{$_("common.buttons.delete")}
		</DeleteButton>
	</svelte:fragment>
</Modal>
