<script>
  import {onMount, setContext} from "svelte"
  import {get} from "svelte/store"
  import Router from "svelte-spa-router"
  import keymage from "keymage"

  import "./locale/i18n"
  import {changeLang, locale, languages, GetFlagPath} from "./locale/i18n"
  // import {_} from "svelte-i18n"
  import routes, {Routes, Urls} from "./routes"

  // import currentUser from "./stores/current-user"
  import {
	  login,
	  isAuthenticated,
	  userInfo,
	  AzureProvider,
	  ZuubrProvider,
	  appMountCallback,
	  logout
  } from "./stores/authentication"

  import {
	  TopNavigation,
	  PageHeader,
	  Sidebar,
	  SidebarNavItem,
	  TopNavItem,
	  Loader,
	  UserDropdownMenu,
	  Dropdown,
	  DropdownItem,
	  DropdownButton,
	  DropdownMenu,
	  Label
  } from "svelte-adminlte"

  import MessageLog from "./controls/modals/MessageLog.svelte"
  // import {initSocket} from "./providers/socket"
  import SidebarNavTree from "./controls/SidebarNavTree.svelte"

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

  function changeLanguage(e, lang) {
	  if (lang) {
		  changeLang(lang)
		  location.reload()
	  }
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
					<DropdownItem href="#{Urls.Route1}">Route 1</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</svelte:fragment>

		<svelte:fragment slot="right">
			<Dropdown>
				<DropdownButton>
					<img
						src={GetFlagPath(localeLanguage)}
						alt={localeLanguage}
					/>
				</DropdownButton>
				<div id="language-dropdown">
					<DropdownMenu right>
						{#each languages as l}
							<div
								class="lang-item"
								on:click={e => changeLanguage(e, l.code)}
							>
								<img src={GetFlagPath(l.code)} alt={l.img} />
								{l.title || l.code}
							</div>
						{/each}
					</DropdownMenu>
				</div>
			</Dropdown>
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
		{#each Routes as route}
			{#if !route.hide}
				{#if route.nesting}
					<SidebarNavTree icon={route.icon} href="#{route.route}">
						{route.title}
						<svelte:fragment slot="children">
							{#each route.subroutes as sub}
								<SidebarNavItem icon={sub.icon} href="#{sub.route}">
									<p>{sub.title}</p>
								</SidebarNavItem>
							{/each}
						</svelte:fragment>
					</SidebarNavTree>
				{:else}
					<SidebarNavItem icon={route.icon} href="#{route.route}">
						<p>{route.title}</p>
					</SidebarNavItem>
				{/if}
			{/if}
		{/each}
	</Sidebar>

	<div class="content-wrapper">
		<div class="content">
			<Router {routes} />
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
