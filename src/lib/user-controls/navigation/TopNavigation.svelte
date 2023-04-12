<script>
	import {Dropdown, DropdownButton, DropdownItem, DropdownMenu, TopNavigation, TopNavItem} from "@keenmate/svelte-adminlte"
	import {AzureProvider, login, logout} from "../../stores/authentication"
	import LocaleDropdown from "../../components/locale/LocaleDropdown.svelte"

	export let isAuthenticated
	export let userInfo
</script>

<TopNavigation>
	<svelte:fragment slot="right">
		<LocaleDropdown />

		{#if $isAuthenticated}
			<Dropdown slot="right">
				<DropdownButton>{$userInfo.name}</DropdownButton>

				<DropdownMenu right>
					<DropdownItem on:click={() => logout()}>Log Out</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		{:else}
			<Dropdown>
				<DropdownButton>Log In</DropdownButton>
				<DropdownMenu right>
					<DropdownItem on:click={() => login(AzureProvider)}>
						Azure
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		{/if}
	</svelte:fragment>
</TopNavigation>
