<script lang="ts">
	import {
		Dropdown,
		DropdownButton,
		DropdownMenu,
	} from "@keenmate/svelte-adminlte"
	import {CurrentUser} from "$lib/stores/authentication.js"

	// function onToggleShowcaseFeaturesEnabled(ev: Event) {
	// 	ev.stopImmediatePropagation()
	// 	ev.preventDefault()
	//
	// 	updateShowcaseFeaturesEnabledPreference(!$Preferences.showcaseFeaturesEnabled)
	// }
	//
	// function onTogglePowerSaveMode(ev: Event) {
	// 	ev.stopImmediatePropagation()
	// 	ev.preventDefault()
	//
	// 	updatePowerSaveModePreference(!$Preferences.powerSaveMode)
	// }
</script>

{#if $CurrentUser}
	<Dropdown class="current-user-roles-item">
		<DropdownButton>
			{$CurrentUser.displayName}
		</DropdownButton>

		<DropdownMenu>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!--<div-->
			<!--	class="d-flex align-items-center gap-2 user-select-none"-->
			<!--	on:click={onToggleShowcaseFeaturesEnabled}-->
			<!--&gt;-->
			<!--		&lt;!&ndash;on:change={onToggleShowcaseFeaturesEnabled}&ndash;&gt;-->
			<!--	<Checkbox-->
			<!--		id="showcase-features-enabled"-->
			<!--		checked={$Preferences.showcaseFeaturesEnabled}-->
			<!--	>-->
			<!--	</Checkbox>-->
			<!--	<Label inputId="showcase-features-enabled" class="cursor-pointer mb-0">-->
			<!--		{$_("common.labels.showcaseFeaturesEnabled")}-->
			<!--	</Label>-->
			<!--</div>-->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!--<div-->
			<!--	class="d-flex align-items-center gap-2 user-select-none"-->
			<!--	on:click={onTogglePowerSaveMode}-->
			<!--&gt;-->
			<!--		&lt;!&ndash;on:change={onToggleShowcaseFeaturesEnabled}&ndash;&gt;-->
			<!--	<Checkbox-->
			<!--		id="power-save-mode-enabled"-->
			<!--		checked={$Preferences.powerSaveMode}-->
			<!--	>-->
			<!--	</Checkbox>-->
			<!--	<Label inputId="power-save-mode-enabled" class="cursor-pointer mb-0">-->
			<!--		{$_("common.labels.powerSaveMode")}-->
			<!--	</Label>-->
			<!--</div>-->
		</DropdownMenu>
	</Dropdown>
{/if}

<style lang="scss" global>
	.current-user-roles-item {
		.dropdown-menu {
			left: unset !important;
			right: 0 !important;
			width: min(20rem, 98vw);

			& > * {
				padding: .25rem .5rem;
			}
		}
	}
</style>
