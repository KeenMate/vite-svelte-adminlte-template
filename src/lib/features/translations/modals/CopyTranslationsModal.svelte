<script lang="ts">
	import {preventDefault, stopPropagation} from "svelte/legacy"

	import SaveButton from "$lib/components/common/buttons/SaveButton.svelte"
	import {getLanguagesAsync} from "$lib/providers/socket/const-channel.js"
	import {createEventDispatcher} from "svelte"
	import {_} from "svelte-i18n"
	import {Checkbox, FormGroup, Label, Modal, ModalCloseButton, TextInput, Toastr} from "@keenmate/svelte-adminlte"
	import SvelteSelect from "svelte-select"
	import {WarningToastrTimeout} from "$lib/constants/toastr.js"
	import type {CodeValueType} from "$lib/types/index.js"

	const dispatch = createEventDispatcher()

	export function showModal(sourceLanguageCode_: string) {
		sourceLanguageCode = sourceLanguageCode_
		sourceLanguage     = null
		targetLanguage     = null
		dataGroupCode      = null

		loadLanguagesAsync()

		show()
	}

	export function hideModal() {
		hide()
	}

	let show: VoidFunction = $state()
	let hide: VoidFunction = $state()

	let sourceLanguageCode: string
	let sourceLanguage: CodeValueType | null = $state()
	let targetLanguage: CodeValueType | null = $state()
	let languages: CodeValueType[]           = $state()
	let dataGroupCode: string | null         = $state()
	let overwrite: boolean                   = $state()

	function onSubmit() {
		if (!sourceLanguage || !targetLanguage) {
			Toastr.warn($_("translations.notifications.missingRequiredValues"), {timeout: WarningToastrTimeout})
			return
		}

		if (sourceLanguage.code === targetLanguage.code) {
			Toastr.warn($_("translations.notifications.sameSourceTargetLanguage"), {timeout: WarningToastrTimeout})
			return
		}

		dispatch("submit", {
			data:     {
				sourceLanguage: sourceLanguage.code,
				targetLanguage: targetLanguage.code,
				dataGroup:      dataGroupCode,
				overwrite
			},
			callback: hide
		})
	}

	async function loadLanguagesAsync() {
		try {
			const response = await getLanguagesAsync()

			languages = response.data

			if (sourceLanguageCode) {
				sourceLanguage = languages?.find(x => x.code === sourceLanguageCode)
			}
		} catch (error) {
			console.error("Could not load languages", error)
			Toastr.error($_("translations.notifications.languagesNotLoaded"))
		}
	}

	function swapLanguages() {
		const tmp = sourceLanguage

		sourceLanguage = targetLanguage
		targetLanguage = tmp
	}
</script>

<form onsubmit={stopPropagation(preventDefault(onSubmit))}>
	<Modal bind:show bind:hide>
		{#snippet header()}

			{$_("translations.headers.cloneTranslations")}

		{/snippet}

		<div class="row align-items-center">
			<div class="col-md">
				<FormGroup>
					<Label>{$_("translations.labels.sourceLanguage")}</Label>

					<SvelteSelect
						bind:value={sourceLanguage}
						items={languages}
						itemId="code"
						label="value"
						placeholder={$_("translations.placeholders.selectSourceLanguage")}
					/>
					<!--{#if sourceLanguageCode}-->
					<!--	<TextInput-->
					<!--		value={sourceLanguage?.value || ""}-->
					<!--		size="sm"-->
					<!--		readonly-->
					<!--		disabled-->
					<!--	/>-->
					<!--{:else}-->
					<!--{/if}-->
				</FormGroup>
			</div>
			<div
				class="col-md-auto cursor-pointer"
				title={$_("translations.tooltips.swapSourceTargetLanguages")}
				onclick={swapLanguages}
			>
				<i class="fas fa-arrows-alt-h fa-fw"></i>
			</div>
			<div class="col-md">
				<FormGroup>
					<Label>{$_("translations.labels.targetLanguage")}</Label>

					<SvelteSelect
						bind:value={targetLanguage}
						items={languages}
						itemId="code"
						label="value"
						placeholder={$_("translations.placeholders.selectTargetLanguage")}
					/>
				</FormGroup>
			</div>
		</div>
		<FormGroup>
			<Label>{$_("translations.labels.dataGroupOptional")}</Label>

			<TextInput
				bind:value={dataGroupCode}
				placeholder={$_("translations.placeholders.specifyDataGroupToClone")}
				title={$_("translations.tooltips.dataGroupOptional")}
				size="sm"
			/>
		</FormGroup>

		<Checkbox bind:checked={overwrite}>
			{$_("translations.labels.overwrite")}
		</Checkbox>

		{#snippet actions()}

			<ModalCloseButton>
				{$_("common.buttons.close")}
			</ModalCloseButton>

			<SaveButton>
				{$_("translations.buttons.copy")}
			</SaveButton>

		{/snippet}
	</Modal>
</form>
