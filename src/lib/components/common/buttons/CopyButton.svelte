<script lang="ts">
	import {LteButton, Toastr} from "@keenmate/svelte-adminlte"
	import {copyToClipboard} from "$lib/helpers/clipboard-helper.js"
	import {_} from "svelte-i18n"

	type Props = {
		copyText: string;
		[key: string]: any
	}

	let {copyText, ...rest}: Props = $props()

	async function onCopyValueClicked() {
		if (!copyText) {
			console.warn("No text to copy")
			Toastr.warning($_("common.notifications.nothingToCopy"))
			return
		}

		try {
			await copyToClipboard(copyText)

			Toastr.success($_("common.notifications.copiedToClipboard"))
		} catch (error) {
			Toastr.error($_("common.notifications.copyToClipboardNotSuccessful"))
			console.warn("Error occurred while trying to copy api key's field to clipboard", error)
		}
	}
</script>

<LteButton
	color="info"
	{...rest}
	on:click={onCopyValueClicked}
>
	<i class="fas fa-copy fa-fw"></i>
</LteButton>

