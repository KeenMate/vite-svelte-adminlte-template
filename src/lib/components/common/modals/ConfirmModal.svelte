<script module lang="ts">
	export type Options = {
		icon?: string
		confirmColor?: string
		confirmText?: string
	}

	//
</script>

<script lang="ts">
	import {tick} from "svelte"
	import {LteButton, Modal, ModalCloseButton} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"

	const defaultColor = "success"
	const defaultIcon  = "fas fa-check fa-fw"

	let modalElement: Modal          = $state()!
	let jModalElement: any           = $state()
	let message: string | undefined  = $state()
	let header: string | undefined   = $state()
	let options: Options | undefined = $state()

	let resolveModal: (data: any) => void

	export async function showModal(
		m: string,
		h: string,
		_options?: Options
	) {
		message = m
		header  = h
		options = _options
		await tick()

		modalElement.show()

		return new Promise(resolve => {
			resolveModal = resolve
		})
	}

	export function hideModal() {
		modalElement.hide()
	}

	$effect(() => {
		jModalElement && jModalElement.off("hidden.bs.modal", doReject)
	})
	$effect(() => {
		jModalElement && jModalElement.on("hidden.bs.modal", doReject)
	})

	function doReject() {
		resolveModal(false)
		hide()
	}

	function doConfirm() {
		resolveModal(true)
		hide()
	}
</script>

<Modal bind:jModalElement bind:this={modalElement}>
	{#snippet header()}
		{header || ""}
	{/snippet}

	<p>
		{message || ""}
	</p>

	{#snippet actions()}

		<ModalCloseButton>
			{$_("common.buttons.close")}
		</ModalCloseButton>

		<LteButton
			color={options?.confirmColor ?? defaultColor}
			small
			on:click={doConfirm}
		>
			<i class={options?.icon ?? defaultIcon}></i>
			{options?.confirmText ?? $_("common.buttons.confirm")}
		</LteButton>

	{/snippet}
</Modal>
