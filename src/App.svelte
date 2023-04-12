<script>
	import ConnectionClosedModal from "$lib/components/modals/ConnectionClosedModal.svelte"
	import {DefaultZoomLevel, MapCoordinatesSetter, updateMapCoordsLocalStorage} from "$lib/constants/map.js"
	import OsmCitiesFilter from "$lib/features/addresses-map/components/filters/OsmCitiesFilter.svelte"
	import {createUserNotificationsChannel} from "$lib/features/notifications/channel.js"
	import {pageIsActive} from "$lib/helpers/page-helpers.js"
	import {updateQuerystringPartial} from "$lib/helpers/router-helpers.js"
	import BaseProvider from "$lib/providers/base-provider.js"
	import {getUserContextAsync} from "$lib/providers/context-provider.js"
	import {SocketReconnectRetriesFailed} from "$lib/providers/socket/index.js"
	import {isAuthenticated, userContext} from "$lib/stores/authentication.js"
	import {Badge, Dropdown, DropdownButton, DropdownItem, DropdownMenu, LteButton, Toastr, TopNavigation, TopNavItem} from "@keenmate/svelte-adminlte"
	import keymage from "keymage"
	import {onDestroy, onMount, setContext} from "svelte"
	import {_} from "svelte-i18n"
	import Router, {location} from "svelte-spa-router"
	import {writable} from "svelte/store"
	import SidebarNavigation from "./lib/components/common/navigation/SidebarNavigation.svelte"
	import TopNavigationNotifications from "./lib/components/common/navigation/TopNavigationNotifications.svelte"
	import Footer from "./lib/components/common/ui/Footer.svelte"
	import LocaleDropdown from "./lib/components/locale/LocaleDropdown.svelte"
	import {ErrorToastrTimeout} from "./lib/constants/toastr"
	import {LogoutUrl} from "./lib/constants/urls"
	import {onRouteLoaded} from "./lib/helpers/page-helpers"
	import "./lib/locale/i18n"
	import MessageLog from "./lib/modals/MessageLog.svelte"
	import RoutePages from "./lib/pages"
	import MeProvider from "./lib/providers/me-provider"
	import {initSocket} from "./lib/providers/socket"
	import {currentUser} from "./lib/stores/authentication"
	import {listenPageTitleChanged} from "./lib/stores/page-title"

	const reauthorizationNeeded = writable(false)

	let loading = false
	let showLog
	let pageTitleSubscription
	let userNotificationsChannel

	setContext("loader", {
		setLoading: val => (loading = val)
	})

	// page-specific data
	let selectedCity
	let showConnectionClosedModal

	$: $userContext.socketToken && initSocket($userContext.socketToken)
	$: createUserChannel($currentUser)
	$: $SocketReconnectRetriesFailed && showConnectionClosedModal && showConnectionClosedModal()

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
		MeProvider.clearSessionStorage()
		window.location.replace(LogoutUrl)
	}

	async function loadUserContextAsync() {
		try {
			if (import.meta.env.DEV) {
				const response = await getUserContextAsync()

				userContext.set(response.data)
			}
		} catch (error) {
			if (error.status === 401) {
				console.debug("User context not loaded because user is unauthenticated")
				return
			}

			console.error("Could not load user context", error)
			Toastr.error("User context could not be loaded", null, {timeOut: ErrorToastrTimeout})
		}
	}


	function routeLoaded({detail: route}) {
		return onRouteLoaded(route, $_)
	}

	function createUserChannel(user) {
		if (!user || !user.userId) return

		// if (userChannel) userChannel.destroy()
		//
		userNotificationsChannel = createUserNotificationsChannel(user.userId)

		// userNotificationsChannel.join()
	}

	// function handleEndSession() {
	// 	console.log("Session ended")
	// 	reauthorizationNeeded.set(true)
	// }

	function reauthorize() {
		window.addEventListener("reauthenticated", handleReauthorizationSuccess, {
			once: true
		})

		window.open("/admin/reauth-silent", "_blank", "width=400,height=475")
	}

	function handleReauthorizationSuccess({detail: token}) {
		console.log("Reauthenticated event received")
		initSocket(token)
		reauthorizationNeeded.set(false)
	}

	function onLoginUser() {
		const handle = BaseProvider.loginPopup("/popup-logged-in")

		let checker = setInterval(() => {
			if (!handle.closed)
				return
			console.info("Loading user details")
			clearInterval(checker)

			loadUserContextAsync()
		}, 1000)
	}

	async function updateCoordinates(latLong) {
		$MapCoordinatesSetter = {
			lat: latLong.lat,
			long: latLong.lon,
			zoom: DefaultZoomLevel
		}
		updateQuerystringPartial($MapCoordinatesSetter)
		updateMapCoordsLocalStorage($MapCoordinatesSetter)
	}
</script>

<div class="wrapper condensed">
	<TopNavigation>
		<svelte:fragment slot="left">
			<LocaleDropdown />
			{#if pageIsActive($location, "AddressesMapPage")}
				<li class="nav-item d-flex align-items-center cities-filter">
					<OsmCitiesFilter value={selectedCity} on:input={ev => updateCoordinates(ev.detail)} />
				</li>
			{/if}
		</svelte:fragment>
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
			<TopNavigationNotifications />
			{#if $isAuthenticated}
				<Dropdown slot="right">
					<DropdownButton>{$currentUser?.displayName || ""}</DropdownButton>
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

	.cities-filter {
		width: 30rem;
	}
</style>
