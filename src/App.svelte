<script>
  import {onMount, setContext} from "svelte"
  // import {get} from "svelte/store"
  import Router from "svelte-spa-router"
  import keymage from "keymage"

  import "./locale/i18n"
  import {locale} from "./locale/i18n"
  // import {_} from "svelte-i18n"
  import RoutePages, {onRouteLoaded, Pages, PageUrls} from "./pages"

  // import currentUser from "./stores/current-user"
  import {
	  login,
	  isAuthenticated,
	  userInfo,
	  AzureProvider,
	  // ZuubrProvider,
	  appMountCallback,
	  logout
  } from "./stores/authentication"

  import {
	  TopNavigation,
	  Sidebar,
	  SidebarNavItem,
	  TopNavItem,
	  Dropdown,
	  DropdownItem,
	  DropdownButton,
	  DropdownMenu
  } from "svelte-adminlte"

  import MessageLog from "./modals/MessageLog.svelte"
  // import {initSocket} from "./providers/socket"
  import SidebarNavTree from "./user-controls/SidebarNavTree.svelte"
  import LocaleDropdown from "./components/locale/LocaleDropdown.svelte"

  onMount(() => {
	  // initSocket()

	  keymage("ctrl-0", () => {
		  console.log("opening logs")
		  showLog()
	  })
  })

  let loading = false
  let showLog
  let localeLanguage = ""
  const subscription = locale.subscribe((x) => (localeLanguage = x))
  setContext("loader", {
	  setLoading: (val) => (loading = val)
  })

  function routeLoaded({detail: route}) {
	  onRouteLoaded(route)
  }

  onMount(appMountCallback)
</script>

<div class="wrapper">
	<TopNavigation>
		<svelte:fragment slot="left">
			<TopNavItem href="#/">Home</TopNavItem>
			<Dropdown>
				<DropdownButton>Pages</DropdownButton>

				<DropdownMenu>
					<DropdownItem href="#{PageUrls.Page1}">Page 1</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</svelte:fragment>

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
						<!--<DropdownItem on:click={() => login(ZuubrProvider)}>-->
						<!--	Zuubr-->
						<!--</DropdownItem>-->
					</DropdownMenu>
				</Dropdown>
			{/if}
		</svelte:fragment>
	</TopNavigation>

	<Sidebar>
		{#each Pages as page}
			{#if !page.hide}
				{#if page.nesting}
					<SidebarNavTree icon={page.icon} href="#{page.url}">
						{page.title}
						<svelte:fragment slot="children">
							{#each page.subroutes as sub}
								<SidebarNavItem icon={sub.icon} href="#{sub.url}">
									<p>{sub.title}</p>
								</SidebarNavItem>
							{/each}
						</svelte:fragment>
					</SidebarNavTree>
				{:else}
					<SidebarNavItem icon={page.icon} href="#{page.url}">
						<p>{page.title}</p>
					</SidebarNavItem>
				{/if}
			{/if}
		{/each}
	</Sidebar>

	<div class="content-wrapper">
		<div class="content">
			<Router routes={RoutePages} on:routeLoaded={routeLoaded} />
		</div>
	</div>

	<MessageLog bind:show={showLog} />
</div>

<style lang="sass">
		:global
			#language-dropdown
				.dropdown-menu
					min-width: 0

	.lang-item
		cursor: pointer
		white-space: nowrap
		padding: 0 1rem
</style>
