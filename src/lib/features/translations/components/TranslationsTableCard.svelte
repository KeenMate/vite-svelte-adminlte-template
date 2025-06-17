<script lang="ts">
	import FilterableValue from "$lib/components/common/table/FilterableValue.svelte"
	import PaginationFooter from "$lib/components/common/table/PaginationFooter.svelte"
	import CopyTranslationsModal from "$lib/features/translations/modals/CopyTranslationsModal.svelte"
	import {ConstChannel, getLanguagesAsync} from "$lib/providers/socket/const-channel.js"
	import {createEventDispatcher, getContext, onMount} from "svelte"
	import {
		AutoScroll,
		Callout,
		Card,
		InputGroup, LoadingRow,
		NumberInput,
		TableCondensed,
		TableRowFullWidth,
		TextInput,
		Toastr,
		WithLazyLoader
	} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import SvelteSelect from "svelte-select"
	import ItemsFiltersTopPanel from "./TranslationsTopPanel.svelte"
	import type {LanguageItem, Translation} from "$lib/features/translations/types.js"
	import type {PaginationType, StringDict} from "$lib/types/index.js"
	import NoDataRow from "$lib/components/common/table/NoDataRow.svelte"
	import NoExactMatchesRow from "$lib/components/shared/addresses/NoExactMatchesRow.svelte"

	const dispatch = createEventDispatcher()

	export let contextKey: Symbol
	export let filters: StringDict
	export let itemsTask: Promise<Translation[]>
	export let pagination: PaginationType
	export let pages: number | null
	export let specificLanguageCode = false

	const {
		focusedRowIndex,
		focusedField
	} = getContext(contextKey) as any

	// let showDeleteItemModal
	// let hideDeleteItemModal
	let showCopyTranslationsModal: (languageCode: string) => void
	let hideCloneTranslationsModal: VoidFunction

	let itemInputs = {
		value: []
	}

	let newItem: Translation | null = null
	let languages: LanguageItem[] = []

	$: $focusedField && $focusedRowIndex && (itemInputs[$focusedField][$focusedRowIndex]?.focus()/*, itemInputs[$focusedField][$focusedRow]?.select()*/)

	onMount(() => {
		ConstChannel.join()

		loadLanguagesAsync()
	})

	function onAddNewItem() {
		newItem = {
			languageCode: "",
			dataGroup: "",
			dataObjectCode: "",
			dataObjectId: null,
			value: ""
		}

		loadLanguagesAsync()
	}

	async function loadLanguagesAsync() {
		try {
			const response = await getLanguagesAsync()

			languages = response.data
			console.log("Languages loaded", languages)
		} catch (error) {
			console.error("Could not load languages for translations", error)
			Toastr.error($_("translations.notifications.languagesNotLoaded"))
		}
	}

	function submitItem(item: Translation, index: number | null, callback?: VoidFunction) {
		dispatch("submit", {
			item,
			index: index || 0,
			callback: callback || function() {
				newItem = null
			}
		})
	}

	function onCreate() {
		submitItem(newItem, null, () => {
			newItem = null
		})
	}

	function updateItem(ev: KeyboardEvent, item: Translation, index: number | null, field: string) {
		if (ev.code === "Enter") {
			ev.preventDefault()
			ev.stopImmediatePropagation()
		}

		$focusedField = field
		submitItem({...item, [field]: (ev.target as HTMLInputElement).value}, index + (ev.shiftKey && -1 || 1))
	}

	function moveOnEnter(ev: KeyboardEvent, index: number | null, field: string) {
		if (ev.code !== "Enter") {
			return
		}

		ev.preventDefault()
		ev.stopImmediatePropagation()

		$focusedField = field
		$focusedRowIndex = index + (ev.shiftKey && -1 || 1)
	}
</script>

<Card noPadding>
	<svelte:fragment slot="fullHeader">
		<ItemsFiltersTopPanel
			{contextKey}
			{filters}
			{languages}
			{specificLanguageCode}
			creatingNewItem={!!newItem}
			on:addNewItem={onAddNewItem}
			on:saveNewItem={onCreate}
			on:copyTranslations={() => showCopyTranslationsModal(specificLanguageCode)}
			on:reload
		/>
	</svelte:fragment>

	<div class="my-2 px-2">
		<PaginationFooter {pagination} {pages} />
	</div>

	<AutoScroll>
		<TableCondensed class="table-hover center-align-cells">
			<tr slot="headers">
				{#if !specificLanguageCode}
					<th class="pr-3">{$_("translations.tableColumns.languageCode")}</th>
				{/if}
				<th class="pr-3">{$_("translations.tableColumns.dataGroup")}</th>
				<th class="pr-3">{$_("translations.tableColumns.dataObjectCode")}</th>
				<th class="pr-3">{$_("translations.tableColumns.dataObjectId")}</th>
				<th>{$_("common.tableColumns.title")}</th>
			</tr>

			{#if newItem}
				<tr>
					<td>
						<InputGroup size="sm">
							{#if specificLanguageCode}
								<TextInput
									value={languages?.find(x => x.code === specificLanguageCode)?.value || ""}
									size="sm"
								/>
							{:else}
								<SvelteSelect
									id="filters-language"
									class="form-control form-control-sm"
									value={languages?.find(x => x.code === newItem.languageCode)}
									items={languages}
									itemId="code"
									label="value"
									placeholder={$_("translations.placeholders.selectLanguage")}
									on:select={ev => newItem.languageCode = ev.detail.code}
									on:clear={() => newItem.languageCode = null}
								/>
							{/if}
						</InputGroup>
					</td>
					<td>
						<InputGroup size="sm">
							<TextInput
								bind:value={newItem.dataGroup}
								placeholder={$_("translations.placeholders.enterDataGroup")}
								size="sm"
							/>
						</InputGroup>
					</td>
					<td>
						<InputGroup size="sm">
							<TextInput
								bind:value={newItem.dataObjectCode}
								placeholder={$_("translations.placeholders.enterDataObjectCode")}
								size="sm"
							/>
						</InputGroup>
					</td>
					<td>
						<InputGroup size="sm">
							<NumberInput
								bind:value={newItem.dataObjectId}
								placeholder={$_("translations.placeholders.enterDataObjectId")}
							/>
						</InputGroup>
					</td>
					<td>
						<InputGroup size="sm">
							<TextInput
								bind:value={newItem.value}
								placeholder={$_("translations.placeholders.enterTranslation")}
								size="sm"
							/>
						</InputGroup>
					</td>
				</tr>
			{/if}

			<WithLazyLoader task={itemsTask} let:data>
				<svelte:fragment slot="loader">
					<LoadingRow />
				</svelte:fragment>

				{#each data || [] as item, index (item.translationId)}
					<tr>
						{#if !specificLanguageCode}
							<td class="auto-width pr-3">
								<FilterableValue
									{contextKey}
									queryKey="languageCode"
									value={item.languageCode}
									title={item.languageValue}
								/>
							</td>
						{/if}
						<td class="auto-width pr-3">
							<FilterableValue
								{contextKey}
								queryKey="dataGroup"
								value={item.dataGroup}
								title={item.dataGroup || ""}
							/>
						</td>
						<td class="auto-width pr-3">
							<FilterableValue
								{contextKey}
								queryKey="dataObjectCode"
								value={item.dataObjectCode}
								title={item.dataObjectCode || ""}
							/>
						</td>
						<td class="auto-width pr-3">
							<FilterableValue
								{contextKey}
								queryKey="dataObjectId"
								value={item.dataObjectId}
								title={item.dataObjectId || ""}
							/>
						</td>
						<td class="translation-value">
							<InputGroup size="sm">
								<TextInput
									bind:inputElement={itemInputs.value[index]}
									value={item.value}
									placeholder={$_("translations.placeholders.enterValue")}
									size="sm"
									on:keypress={ev => moveOnEnter(ev, index, "value")}
									on:change={ev => updateItem(ev, item, index, "value")}
								/>
							</InputGroup>
						</td>
					</tr>
				{:else}
					{#if filters && Object.values(filters).some(x => x)}
						<NoExactMatchesRow />
					{:else}
						<NoDataRow />
					{/if}
				{/each}
				<svelte:fragment slot="catch">
					<Callout>
						{$_("common.warnings.errorOccurred")}
					</Callout>
				</svelte:fragment>
			</WithLazyLoader>
		</TableCondensed>
	</AutoScroll>

	<div class="my-2 px-2">
		<PaginationFooter {pagination} {pages} />
	</div>

</Card>

<CopyTranslationsModal
	bind:showModal={showCopyTranslationsModal}
	bind:hideModal={hideCloneTranslationsModal}
	on:submit={ev => dispatch("copyTranslations", ev.detail)}
/>

<!--<DeleteItemModal-->
<!--	bind:showModal={showDeleteItemModal}-->
<!--	bind:hideModal={hideDeleteItemModal}-->
<!--	let:data-->
<!--	on:delete={ev => dispatch("delete", {item: ev.detail, callback: hideDeleteItemModal})}-->
<!--&gt;-->
<!--	{$_("languages.questions.sureToDelete")}-->
<!--	<strong>{data?.title || ""}</strong>-->
<!--</DeleteItemModal>-->

<style lang="scss">
	td.translation-value {
		min-width: 15rem;
	}
</style>
