<script lang="ts">
	import {TypingDebounceDelay} from "$lib/constants/ui.js"
	import debounce from "lodash/debounce.js"
	import {createEventDispatcher, getContext} from "svelte"
	import {
		InputGroup,
		InputGroupAppend,
		InputGroupPrepend,
		LteButton,
		NumberInput,
		RefreshButton,
		TextInput,
		WithPermissions
	} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import SvelteSelect from "svelte-select"
	import {replace} from "@keenmate/svelte-spa-router"
	import {TranslationsPermissions} from "$lib/constants/permissions.js"
	import type {StringDict} from "$lib/types/index.js"
	import ClearFilterTextInputAppend from "$lib/components/common/buttons/ClearFilterTextInputAppend.svelte"
	import {SourceAddressesPageFiltersKey} from "$lib/features/source-addresses/constants/index.js"
	import ClearFiltersButton from "$lib/components/common/buttons/ClearFiltersButton.svelte"
	import {TranslationsPageFiltersKey} from "$lib/features/translations/constants.js"
	import {updateQuerystringAsync, updateQuerystringPartialAsync} from "@keenmate/js-common-helpers/helpers/router.js"
	import {updatePageFiltersPreference} from "$lib/stores/preferences.js"

	const dispatch = createEventDispatcher()

	let {
		    contextKey,
		    filters,
		    languages,
		    specificLanguageCode,
		    creatingNewItem
	    } = $props()

	const updateFiltersDebounce = debounce(updateFilters, TypingDebounceDelay)

	const {updateFiltersUrl} = getContext(contextKey)

	let languageItem = $derived(languages?.find(x => x.code === filters.languageCode))

	function updateFilters(partialFilters: object | StringDict) {
		const newFilters = {
			...partialFilters,
			page: null
		}

		updatePageFiltersPreference(TranslationsPageFiltersKey, newFilters, true)
		updateQuerystringPartialAsync(newFilters)
	}
</script>

<div class="filters row">
	<div class="col-lg">
		<div class="row">
			<div class="col-md-auto">
				<InputGroup size="sm">
					<InputGroupPrepend text>
						<i class="fas fa-search fa-fw"></i>
					</InputGroupPrepend>
					<TextInput
						value={filters.searchText}
						placeholder={$_("translations.placeholders.filterByTranslation")}
						size="sm"
						autofocus
						on:input={ev => updateFiltersDebounce({searchText: ev.target.value})}
					/>
					<ClearFilterTextInputAppend
						value={filters.searchText}
						queryKey="searchText"
						updateQuery={updateFilters}
					/>
				</InputGroup>
			</div>
			<div class="col-lg-3 col-md-4">
				<InputGroup size="sm">
					<InputGroupPrepend text>
						<i class="fas fa-globe-europe fa-fw"></i>
					</InputGroupPrepend>
					{#if specificLanguageCode}
						<TextInput
							value={languages?.find(x => x.code === specificLanguageCode)?.value || ""}
							size="sm"
							readonly
							disabled
						/>
					{:else}
						<SvelteSelect
							id="filters-language"
							class="form-control form-control-sm"
							value={languageItem}
							items={languages}
							itemId="code"
							label="value"
							placeholder={$_("translations.placeholders.filterByLanguage")}
							on:select={ev => updateFilters({languageCode: ev.detail.code})}
							on:clear={() => updateFilters({languageCode: null})}
						/>
					{/if}
				</InputGroup>
			</div>
			<div class="col-md-auto">
				<InputGroup size="sm">
					<TextInput
						value={filters.dataGroup}
						placeholder={$_("translations.placeholders.filterByDataGroup")}
						size="sm"
						on:input={ev => updateFiltersDebounce({dataGroup: ev.target.value})}
					/>
					<ClearFilterTextInputAppend
						value={filters.dataGroup}
						queryKey="dataGroup"
						updateQuery={updateFilters}
					/>
				</InputGroup>
			</div>
			<div class="col-md-auto">
				<InputGroup size="sm">
					<TextInput
						value={filters.dataObjectCode}
						placeholder={$_("translations.placeholders.filterByDataObjectCode")}
						size="sm"
						on:input={ev => updateFiltersDebounce({dataObjectCode: ev.target.value})}
					/>
					<ClearFilterTextInputAppend
						value={filters.dataObjectCode}
						queryKey="dataObjectCode"
						updateQuery={updateFilters}
					/>
				</InputGroup>
			</div>
			<div class="col-md-auto">
				<InputGroup size="sm">
					<NumberInput
						value={filters.dataObjectId}
						placeholder={$_("translations.placeholders.filterByDataObjectId")}
						on:input={ev => updateFiltersDebounce({dataObjectId: ev.target.value})}
					/>
					<ClearFilterTextInputAppend
						value={filters.dataObjectId}
						queryKey="dataObjectId"
						updateQuery={updateFilters}
					/>
				</InputGroup>
			</div>

			<div class="col-md-auto">
				<ClearFiltersButton pageFiltersKey={TranslationsPageFiltersKey} />
			</div>
		</div>
	</div>

	<div class="actions col-12 col-md-auto p-0">
		<WithPermissions permission={TranslationsPermissions.createTranslation}>
			<LteButton
				color="primary"
				title={$_("translations.tooltips.copyLanguageTranslations")}
				small
				on:click={() => dispatch("copyTranslations")}
			>
				<i class="far fa-clone fa-fw"></i>
			</LteButton>
		</WithPermissions>
		<WithPermissions permission={TranslationsPermissions.readTranslation}>
			<RefreshButton small on:click={() => dispatch("reload")} />
		</WithPermissions>
		<WithPermissions permission={TranslationsPermissions.createTranslation}>
			{#if creatingNewItem}
				<LteButton
					color="success"
					title={$_("common.buttons.save")}
					small
					on:click={() => dispatch("saveNewItem")}
				>
					<i class="fas fa-save fa-fw"></i>
				</LteButton>
			{:else}
				<LteButton
					color="primary"
					title={$_("common.buttons.add")}
					small
					on:click={() => dispatch("addNewItem")}
				>
					<i class="fas fa-plus fa-fw"></i>
				</LteButton>
			{/if}
		</WithPermissions>
	</div>
</div>

<style lang="scss">
	.filters {
		width: 100%;
	}
</style>
