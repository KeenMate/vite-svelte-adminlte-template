<script lang="ts">
	import {_} from "svelte-i18n"
	import {IsAuthenticated} from "$lib/stores/authentication.js"
	import {Badge, LteButton, MobileNavToggle, TopNavigation, TopNavItem} from "@keenmate/svelte-adminlte"
	import {LogoutUrl} from "$lib/constants/urls.js"
	import {onMount} from "svelte"
	import {location} from "@keenmate/svelte-spa-router"
	import EnvBadge from "$lib/components/common/ui/EnvBadge.svelte"
	import {IsSocketConnected, SocketShouldDisconnect} from "$lib/providers/socket/index.js"
	import CurrentUserNavItem from "$lib/components/ui/CurrentUserNavItem.svelte"
	import {DevelopmentFeaturesEnabled} from "$lib/constants/index.js"
	import LocaleDropdown from "$lib/components/locale/LocaleDropdown.svelte"
	import {getActivePage} from "$lib/helpers/page-helpers.js"
	import BrandImage from "$lib/components/common/BrandImage.svelte"
	import {loginUserAsync} from "$lib/authentication/index.js"

	let sidebarToggleElement: HTMLAnchorElement

	let currentPage = $derived(getActivePage($location))

	onMount(() => {
		window.jQuery(sidebarToggleElement).PushMenu?.({})
	})

	function logout() {
		window.location.replace(LogoutUrl)
	}

	function onLoginUserAsync() {
		loginUserAsync()
	}
</script>

<TopNavigation class="" hideMobileNavToggle>
	{#snippet left()}

		<MobileNavToggle visibility="" />
		<li class="nav-item navbar-brand d-none d-md-flex align-items-center">
			<BrandImage />
		</li>
		<li class="nav-item d-flex align-items-center">
			<h5 class="current-page-title p-0 m-0 pl-2">
				{#if currentPage}
					{$_(`routes.${currentPage.name}.title`)}
				{:else}
					{$_("routes.notFound.title")}
				{/if}
			</h5>
		</li>
		<TopNavItem>
			<EnvBadge />
		</TopNavItem>

	{/snippet}
	{#snippet right()}

		{#if $SocketShouldDisconnect && !$IsSocketConnected}
			<TopNavItem>
				<Badge color="danger">
					{$_("common.labels.reconnectFailed")}
				</Badge>
			</TopNavItem>
			<TopNavItem href="javascript:void(0)" on:click={() => onLoginUserAsync()}>
				<LteButton color="primary" small>
					{$_("common.labels.reconnect")}
				</LteButton>
			</TopNavItem>
		{/if}

		<LocaleDropdown />
		{#if $IsAuthenticated}
			<CurrentUserNavItem />
		{:else if DevelopmentFeaturesEnabled}
			<TopNavItem href="javascript:void(0)" on:click={() => onLoginUserAsync()}>
				{$_("common.links.logIn")}
			</TopNavItem>
		{/if}
		<!-- <TopNavigationNotifications /> -->

	{/snippet}
</TopNavigation>

<style lang="scss">
	.page-title {
		--text-color: #212529;

		margin-bottom: 0 !important;
		color: var(--text-color) !important;

		&:hover {
			color: var(--text-color) !important;
		}
	}
</style>
