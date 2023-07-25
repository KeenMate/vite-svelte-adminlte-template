<script lang="ts">
	import {pageIsActive, pageUrl} from "$lib/helpers/page-helpers.js"
	import {location} from "svelte-spa-router"
	import {_} from "svelte-i18n"
	import {SidebarNavItem} from "@keenmate/svelte-adminlte"
	import {checkPermissions} from "@keenmate/js-common-helpers/helpers/permissions"
	import {currentUser} from "$lib/stores/authentication.js"

	// page
	export let name
	export let icon
	export let title = null
	export let hide = false
	export let target = null
	export let permissions: {[key: string]: string[]} = {}

	// common
	export let pageUrls

	let hasPermissions, active, href

	$: hasPermissions = checkPermissions($currentUser?.permissions, permissions)
	$: active = hasPermissions && pageIsActive($location, name)
	$: href = hasPermissions && (pageUrls[name])

	function getPageTitle(i18n) {
		return (typeof title === "function" && title(i18n)) || title || i18n("routes." + name + ".title")
	}
</script>

{#if !hasPermissions || hide}{:else}
	<SidebarNavItem {icon} {href} {active} {target}>
		<p>{getPageTitle($_)}</p>
	</SidebarNavItem>
{/if}
