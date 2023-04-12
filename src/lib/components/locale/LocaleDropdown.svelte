<script>
	import {defaultLanguages} from "$lib/locale/i18n.js"
	import LanguageProvider from "$lib/providers/langauge-provider.js"
	import {changeLang, getFlagPath, locale} from "$lib/locale/i18n"
	import {userContext} from "$lib/stores/authentication.js"
	import {Dropdown, DropdownMenu, DropdownButton} from "@keenmate/svelte-adminlte"

	async function changeLanguage(lang) {
		if (!lang)
			return

		changeLang(lang)
		await LanguageProvider.setLanguage(lang)

		location.reload()
	}
</script>

<div class="language-dropdown">
	<Dropdown>
		<DropdownButton>
			<img
				src={getFlagPath($locale)}
				class="selected-locale-img"
				alt={$locale}
			/>
		</DropdownButton>

		<DropdownMenu right>
			{#each $userContext.languages || defaultLanguages as l (l.code)}
				<div
					class="lang-item"
					on:click={() => changeLanguage(l.code)}
				>
					<img src={getFlagPath(l.code)} alt={l.img} />
					{l.value || l.code}
				</div>
			{/each}
		</DropdownMenu>
	</Dropdown>
</div>

<style lang="scss">
	:global {
		.language-dropdown {
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
