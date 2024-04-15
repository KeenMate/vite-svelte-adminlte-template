<script>
	import ConnectionClosedModal from "$lib/components/modals/ConnectionClosedModal.svelte"
	import {getUserContextAsync} from "$lib/providers/context-provider.js"
	import {SocketReconnectRetriesFailed} from "$lib/providers/socket"
	import {
		Badge,
		Dropdown,
		DropdownButton,
		DropdownItem,
		DropdownMenu,
		LteButton,
		Toastr,
		TopNavigation,
		TopNavItem
	} from "@keenmate/svelte-adminlte"
	import keymage from "keymage"
	import {onDestroy, onMount, setContext} from "svelte"
	import {_} from "svelte-i18n"
	import Router from "svelte-spa-router"
	import {writable} from "svelte/store"
	import SidebarNavigation from "./lib/components/common/navigation/SidebarNavigation.svelte"
	import Footer from "./lib/components/common/ui/Footer.svelte"
	import LocaleDropdown from "./lib/components/locale/LocaleDropdown.svelte"
	import {ErrorToastrTimeout} from "./lib/constants/toastr.js"
	import {LogoutUrl} from "./lib/constants/urls"
	import {onRouteLoaded} from "$lib/helpers/page-helpers.js"

	import "./lib/locale/i18n.js"
	import MessageLog from "$lib/modals/MessageLog.svelte"
	import RoutePages from "./lib/pages"
	import {initSocket} from "./lib/providers/socket/index.js"
	import {
		CurrentUser,
		isAuthenticated,
		userContext
	} from "./lib/stores/authentication.js"
	import {listenPageTitleChanged} from "./lib/stores/page-title.js"
	import {ReauthUrl} from "$lib/constants/urls.js"
	import BaseProvider from "$lib/providers/base-provider.js"

	const reauthorizationNeeded = writable(false)

	let loading = false
	let showLog
	let pageTitleSubscription

	setContext("loader", {
		setLoading: val => (loading = val)
	})

	// page-specific data
	let showConnectionClosedModal

	$: $userContext.socketToken && initSocket($userContext.socketToken)
	$: $SocketReconnectRetriesFailed &&
		showConnectionClosedModal &&
		showConnectionClosedModal()

	onMount(() => {
		// initSocket(getAdminSocketToken())
		loadUserContextAsync()

		keymage("ctrl-0", () => {
			showLog()
		})

		pageTitleSubscription = listenPageTitleChanged()
	})

	onDestroy(() => {
		if (pageTitleSubscription) pageTitleSubscription()
	})

	function logout() {
		window.location.replace(LogoutUrl)
	}

	async function loadUserContextAsync() {
		try {
			// In dev mode we have separate vite devserver for admin and phoenix server, so we need to fetch user context from server
			// In prod index.html is server by phoenix application and is injected with user context
			if (import.meta.env.DEV) {
				const response = await getUserContextAsync()

				userContext.set(response)
			}
		} catch (error) {
			if (error.status === 401) {
				console.debug("User context not loaded because user is unauthenticated")
				return
			}

			console.error("Could not load user context", error)
			Toastr.error("User context could not be loaded", null, {
				timeOut: ErrorToastrTimeout
			})
		}
	}

	function routeLoaded({detail: route}) {
		return onRouteLoaded(route, $_)
	}

	// function handleEndSession() {
	// 	console.log("Session ended")
	// 	reauthorizationNeeded.set(true)
	// }

	function reauthorize() {
		// @ts-ignores
		window.addEventListener("reauthenticated", handleReauthorizationSuccess, {
			once: true
		})

		window.open(ReauthUrl, "_blank", "width=400,height=475")
	}

	function handleReauthorizationSuccess({detail: token}) {
		console.log("Reauthenticated event received")
		initSocket(token)
		reauthorizationNeeded.set(false)
	}

	function onLoginUser() {
		const handle = BaseProvider.loginPopup("/popup-logged-in")

		let checker = setInterval(() => {
			if (!handle.closed) return
			console.info("Loading user details")
			clearInterval(checker)

			loadUserContextAsync()
		}, 1000)
	}
</script>

<div class="wrapper condensed">
	<TopNavigation>
		<svelte:fragment slot="right">
			{#if $SocketReconnectRetriesFailed}
				<TopNavItem>
					<Badge color="danger">
						{$_("common.labels.reconnect")}
					</Badge>
				</TopNavItem>
			{/if}
			{#if $reauthorizationNeeded}
				<LteButton small on:click={reauthorize}>Reauthorize</LteButton>
			{/if}
			<LocaleDropdown />
			{#if $isAuthenticated}
				<Dropdown slot="right">
					<DropdownButton>{$CurrentUser?.displayName || ""}</DropdownButton>
					<DropdownMenu right>
						<DropdownItem href="/home" target="_blank">
							{$_("common.links.home")}
						</DropdownItem>
						<DropdownItem on:click={() => logout()}>
							{$_("common.links.logOut")}
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			{:else}
				<TopNavItem href="javascript:void(0)" on:click={onLoginUser}>
					{$_("common.links.logIn")}
				</TopNavItem>
			{/if}
		</svelte:fragment>
	</TopNavigation>

	<SidebarNavigation />

	<div class="content-wrapper">
		<div class="content min-full-height">
			<Router routes={RoutePages} on:routeLoaded={routeLoaded} />
		</div>
	</div>

	<Footer />

	<MessageLog bind:show={showLog} />
</div>

<ConnectionClosedModal bind:showModal={showConnectionClosedModal} />

<style lang="scss">
	:global {
		#language-dropdown {
			.dropdown-menu {
				min-width: 0;
			}
		}
	}

	.lang-item {
		cursor: pointer;
		white-space: nowrap;
		padding: 0 1rem;
	}
</style>
