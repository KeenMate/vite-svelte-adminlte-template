<script lang="ts">
	import {isPageActive} from "$lib/helpers/page-helpers.js"
	import {location} from "@keenmate/svelte-spa-router"
	import {_} from "svelte-i18n"
	import {Config, SidebarNavItem} from "@keenmate/svelte-adminlte"
	import {type Requirements} from "@keenmate/js-common-helpers/helpers/permissions.js"
	import {CurrentUser} from "$lib/stores/authentication.js"
	import type {PageUrlsDict} from "$lib/pages/pages.js"

	// page
	export let name: string
	export let icon: string
	export let title: string | ((i18n: (key: string) => string) => string) = null
	export let hide: boolean = false
	export let target: string | null = null
	export let requirements: Requirements = {}

	// common
	export let pageUrls: PageUrlsDict

	let hasPermissions: boolean, active: boolean, href: string

	$: hasPermissions = $Config.permissions.checkPermissions($CurrentUser, requirements)
	$: active = hasPermissions && isPageActive($location, name)
	$: href = hasPermissions && pageUrls[name]

	function getPageTitle(i18n: any) {
		return (typeof title === "function" && title(i18n)) || title || i18n("routes." + name + ".title")
	}
</script>

{#if hasPermissions && !hide}
	<SidebarNavItem {icon} {href} {active} {target}>
		<p>{getPageTitle($_)}</p>
	</SidebarNavItem>
{/if}
