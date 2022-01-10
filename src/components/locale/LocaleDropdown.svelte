<script>
	import {onMount} from "svelte"
	import {changeLang, languages, getFlagPath, locale} from "../../locale/i18n"
	import {Dropdown, DropdownMenu, DropdownButton} from "svelte-adminlte"

	let localeLanguage = ""

	onMount(() => {
		const subscription = locale.subscribe((x) => (localeLanguage = x))
	})

	function changeLanguage(lang) {
		if (!lang)
			return

		changeLang(lang)
		location.reload()
	}
</script>

<div class="language-dropdown">
	<Dropdown>
		<DropdownButton>
			<img
				src={getFlagPath(localeLanguage)}
				class="selected-locale-img"
				alt={localeLanguage}
			/>
		</DropdownButton>

		<DropdownMenu right>
			{#each languages as l (l.code)}
				<div
					class="lang-item"
					on:click={() => changeLanguage(l.code)}
				>
					<img src={getFlagPath(l.code)} alt={l.img} />
					{l.title || l.code}
				</div>
			{/each}
		</DropdownMenu>
	</Dropdown>
</div>

<style lang="sass">
	:global
		.language-dropdown
			.dropdown-menu
				min-width: 0

			.dropdown-toggle
				display: flex
				align-items: center
				gap: .2rem

	.lang-item
		display: flex
		align-items: center
		gap: .5rem

		cursor: pointer
		white-space: nowrap
		padding: 0 .5rem
</style>
