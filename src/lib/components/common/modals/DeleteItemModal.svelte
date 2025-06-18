<script lang="ts">
	import {run} from "svelte/legacy"

	import ModalRejectedError from "$lib/types/modal-rejected-error"
	import {createEventDispatcher} from "svelte"
	import {Modal, ModalCloseButton, DeleteButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	type Props = {
		children?: import("svelte").Snippet<[any]>;
	}

	let {children}: Props = $props()

	const dispatch = createEventDispatcher()

	export function showModal(dd: any) {
		deleteData = dd
		show()

		return new Promise((resolve, reject) => {
			resolveModal = resolve
			rejectModal  = reject
		})
	}

	export function hideModal() {
		hide()
	}

	let jModalElement: Modal = $state()
	let show: () => void     = $state(), hide: () => void = $state()
	let deleteData: any      = $state()

	let resolveModal: (data: any) => void, rejectModal: (reason: any) => void


	function doReject() {
		rejectModal && rejectModal(new ModalRejectedError())
	}

	function doConfirm() {
		resolveModal(deleteData)
		hide()
		dispatch("delete", deleteData)
	}

	$effect(() => {
		jModalElement && jModalElement.off("hidden.bs.modal", doReject)
	})
	$effect(() => {
		jModalElement && jModalElement.on("hidden.bs.modal", doReject)
	})
</script>

<Modal bind:jModalElement bind:show bind:hide>
	{#snippet header()}

		{$_("common.labels.deleteConfirmation")}

	{/snippet}

	{@render children?.({data: deleteData,})}

	{#snippet actions()}

		<ModalCloseButton>
			{$_("common.buttons.cancel")}
		</ModalCloseButton>

		<DeleteButton small on:click={doConfirm}>
			{$_("common.buttons.delete")}
		</DeleteButton>

	{/snippet}
</Modal>
