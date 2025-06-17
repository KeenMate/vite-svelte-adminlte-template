<script lang="ts">
	import {UserContext} from "$lib/stores/authentication.js"
	import {defaultLanguages} from "$lib/locale/i18n.js"
	import MeProvider from "$lib/providers/me-provider.js"
	import {changeLang, getFlagImagePathAsync} from "$lib/locale/i18n.js"
	import {Dropdown, DropdownButton, DropdownMenu} from "@keenmate/svelte-adminlte"
	import {locale} from "svelte-i18n"
	import CountryFlagImage from "$lib/components/locale/CountryFlagImage.svelte"

	async function changeLanguage(lang) {
		if (!lang)
			return

		await MeProvider.setCurrentLocaleAsync(lang)

		changeLang(lang)
	}
</script>

<Dropdown class="language-dropdown">
	<DropdownButton>
		{#await getFlagImagePathAsync($locale) then src}
			<img
				{src}
				class="selected-locale-img flag"
				alt={$locale}
			/>
		{/await}
	</DropdownButton>

	<DropdownMenu right>
		{#each $UserContext.languages || defaultLanguages as l (l.code)}
			<div
				class="lang-item"
				on:click={() => changeLanguage(l.code)}
			>
				<CountryFlagImage countryCode={l.code} alt={l.img} />
				{l.value || l.code}
			</div>
		{/each}
	</DropdownMenu>
</Dropdown>

<style lang="scss">
	:global {
		.language-dropdown {
			.flag {
				width: 21px;
			}

			.dropdown-menu {
				min-width: 0;
			}

			.dropdown-toggle {
				display: flex;
				align-items: center;
				gap: .2rem;
			}
		}
	}

	.lang-item {
		display: flex;
		align-items: center;
		gap: .5rem;

		cursor: pointer;
		white-space: nowrap;
		padding: 0 .5rem;
	}
</style>
