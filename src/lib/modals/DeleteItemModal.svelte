<script lang="ts" generics="T">
	import {run} from "svelte/legacy"

	import ModalRejectedError from "$lib/types/modal-rejected-error.js"
	import {createEventDispatcher} from "svelte"
	import {DeleteButton, Modal, ModalCloseButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	type Props = {
		children?: import("svelte").Snippet<[any]>;
	}

	let {children}: Props = $props()

	const dispatch = createEventDispatcher()

	export function showModal(dd: T) {
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

	let jModalElement: any = $state()
	let show: VoidFunction = $state()
	let hide: VoidFunction = $state()
	let deleteData: T      = $state()

	let resolveModal: Function
	let rejectModal: Function


	function doReject() {
		rejectModal && rejectModal(new ModalRejectedError())
	}

	function doConfirm() {
		resolveModal(deleteData)
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
			{$_("common.buttons.close")}
		</ModalCloseButton>

		<DeleteButton small on:click={doConfirm}>
			{$_("common.buttons.delete")}
		</DeleteButton>

	{/snippet}
</Modal>
