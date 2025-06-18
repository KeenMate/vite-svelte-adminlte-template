<script lang="ts">
	import {onRouteLoaded} from "$lib/helpers/page-helpers.js"
	import BaseProvider from "$lib/providers/base-provider.js"
	import {initSocket} from "$lib/providers/socket/index.js"
	import {IsAuthenticated, loadUserContextAsync, UserContext} from "$lib/stores/authentication.js"
	import {onDestroy, onMount, setContext} from "svelte"
	import {_, isLoading, locale} from "svelte-i18n"
	import Router, {location, replace} from "@keenmate/svelte-spa-router"
	import ApplicationSidebarNavigation from "$lib/components/layout/sidebar/ApplicationSidebarNavigation.svelte"
	import Footer from "$lib/components/common/ui/Footer.svelte"
	import MessageLog from "$lib/modals/MessageLog.svelte"
	import RoutePages, {PageUrls} from "$lib/pages/index.js"
	import {listenPageTitleChanged} from "$lib/stores/page-title.js"
	import SystemProvider from "$lib/providers/system-provider.js"
	import {SystemEnvironment} from "$lib/stores/system.js"
	import {getAccessTokenFromHtml} from "$lib/constants/index.js"
	import LoadingPage from "$lib/pages/LoadingPage.svelte"
	import {type Unsubscriber, writable, type Writable} from "svelte/store"
	import ApplicationTopNavigation from "$lib/components/layout/top-navigation/ApplicationTopNavigation.svelte"
	import {ensurePreferencesOrDefault} from "$lib/stores/preferences.js"
	import {triggerPageResize} from "$lib/helpers/window-helpers.js"
	import {pageUrl} from "@keenmate/js-common-helpers/helpers/url.js"
	import {ConfirmModal} from "@keenmate/svelte-adminlte"
	import {AppContextKey} from "$lib/constants/svelte-context-keys.js"
	import type {AppSvelteContext} from "$lib/types/index.js"
	import AppDisconnect from "$lib/components/common/AppDisconnect.svelte"

	const showConfirmModalAsync: Writable<(message_?: string | null, header_?: string | null, data_?: any) => Promise<boolean>> = writable()
	const hideConfirmModalAsync: Writable<VoidFunction> = writable()

	setContext<AppSvelteContext>(AppContextKey, {
		showConfirmModalAsync,
		hideConfirmModalAsync
	})

	let confirmModalElement: Element & any = $state()
	let showLog: VoidFunction = $state()
	let pageTitleSubscription: Unsubscriber
	// let userNotificationsChannel
	let initialLoad = true

	$effect(() => {
		$showConfirmModalAsync = confirmModalElement?.showModal
		$hideConfirmModalAsync = confirmModalElement?.hideModal
	})

	// page-specific data
	$effect.pre(() => {
		$IsAuthenticated && onLocationChanged($location)
	});
	$effect.pre(() => {
		$UserContext?.socketToken && initSocket($UserContext.socketToken)
	});
	$effect.pre(() => {
		updateLocale($UserContext.currentLocale)
	});
	$effect(() => {
		$IsAuthenticated && onIsAuthenticated()
	});

	onMount(() => {
		ensurePreferencesOrDefault()
		//keymage("ctrl-0", () => {
		//	showLog()
		//})

		pageTitleSubscription = listenPageTitleChanged()
		fixAdminLte()
	})

	onDestroy(() => {
		if (pageTitleSubscription) {
			pageTitleSubscription()
		}
	})

	async function onIsAuthenticated() {
		let accessToken: string
		if (initialLoad) {
			initialLoad = false

			accessToken = getAccessTokenFromHtml()
			//console.log("Access token from html", accessToken)
			if (accessToken) {
				BaseProvider.accessToken = accessToken
			}
		}

		if (!accessToken) {
			await BaseProvider.fetchAccessToken()
		}

		await loadSystemEnvironment()
	}

	async function loadSystemEnvironment() {
		if (!import.meta.env.DEV) {
			return
		}

		const {data} = await SystemProvider.getSystemEnvironmentAsync()
		$SystemEnvironment = data
	}

	function updateLocale(locale_: string) {
		if (!import.meta.env.DEV) {
			return
		}

		$locale = locale_ || "en"
	}

	function onLocationChanged(location_: string) {
		// console.log("on location changed", location_, pageUrl(PageUrls.dashboard))
		// if (location_ === "/") {
		// 	replace(pageUrl(PageUrls.dashboard))
		// }
	}

	function fixAdminLte() {
		triggerPageResize()
		fixSidebarCollapse()
	}

	function fixSidebarCollapse() {
		const toggleSidebarButton = document.querySelector(`[data-widget="pushmenu"][role="button"]`)
		window.jQuery(toggleSidebarButton).PushMenu()
	}

	function routeLoaded({detail: route}) {
		return onRouteLoaded(route, $_)
	}
</script>

{#if $isLoading}
	<LoadingPage />
{:else}
	<div class="wrapper">
		<ApplicationTopNavigation />
		<ApplicationSidebarNavigation />

		<div class="content-wrapper">
			<div class="content">
				<Router
					routes={RoutePages}
					on:routeLoaded={routeLoaded}
				/>
			</div>

			<Footer />
		</div>

		<MessageLog bind:show={showLog} />
	</div>
{/if}

<ConfirmModal
	bind:hideModal={$hideConfirmModalAsync}
	bind:showModal={$showConfirmModalAsync}
/>

<AppDisconnect />
