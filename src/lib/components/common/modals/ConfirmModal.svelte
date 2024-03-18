<script context="module" lang="ts">
	export type showModalFunc = (
		message: string,
		header: string,
		options?: Nullable<options>
	) => Promise<boolean>

	export type options = {
		icon?: string
		confirmColor?: string
		confirmText?: string
	}

	//
</script>

<script lang="ts">
	import {createEventDispatcher, tick} from "svelte"
	import {LteButton, Modal, ModalCloseButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import type {Nullable} from "@keenmate/js-common-helpers/types/helpers.js"

	const dispatch = createEventDispatcher()
	const defaultColor = "success"
	const defaultIcon = "fas fa-check fa-fw"

	let jModalElement: Modal
	let show: () => void, hide: () => void
	let message: string, header: string
	let options: Nullable<options>

	let resolveModal: (data: any) => void

	$: jModalElement && jModalElement.off("hidden.bs.modal", doReject)
	$: jModalElement && jModalElement.on("hidden.bs.modal", doReject)

	export async function showModal(
		m: string,
		h: string,
		_options: Nullable<options> = null
	) {
		message = m
		header = h
		options = _options
		await tick()

		show()

		return new Promise(resolve => {
			resolveModal = resolve
		})
	}

	export function hideModal() {
		hide()
	}

	function doReject() {
		resolveModal(false)
		hide()
	}

	function doConfirm() {
		resolveModal(true)
		hide()
	}
</script>

<Modal bind:jModalElement bind:show bind:hide>
	<svelte:fragment slot="header">
		{header || ""}
	</svelte:fragment>

	<p>
		{message || ""}
	</p>

	<svelte:fragment slot="actions">
		<ModalCloseButton>
			{$_("common.buttons.close")}
		</ModalCloseButton>

		<LteButton
			color={options?.confirmColor ?? defaultColor}
			small
			on:click={doConfirm}>
			<i class={options?.icon ?? defaultIcon} />
			{options?.confirmText ?? $_("common.buttons.confirm")}
		</LteButton>
	</svelte:fragment>
</Modal>
