<script>
	import {pageIsActive, pageUrl} from "$lib/helpers/page-helpers.js"
	import {location} from "svelte-spa-router"
	import {_} from "svelte-i18n"
	import {SidebarNavItem} from "@keenmate/svelte-adminlte"
	import {checkPermissions} from "$lib/helpers/permissions-helpers.js"
	import {currentUser} from "$lib/stores/authentication.js"
	import SidebarNavTreeItem from "$lib/components/common/navigation/SidebarNavTreeItem.svelte"

	// page
	export let name
	export let icon
	export let title = null
	export let nesting = false
	export let subroutes = []
	export let hide = false
	export let permissions = []
	
	// common
	export let pageUrls

	let hasPermissions,
		active,
		href
	
	$: hasPermissions = checkPermissions($currentUser?.permissions, permissions)
	$: active = hasPermissions && pageIsActive($location, name)
	$: href = hasPermissions && !nesting && pageUrl(pageUrls[name])
	
	function getPageTitle(i18n) {
		return typeof title === "function"
			&& title(i18n)
			|| title
			|| i18n("routes." + name + ".title")
	}
</script>

{#if !hasPermissions || hide}
{:else if nesting}
	<SidebarNavTreeItem
		{icon}
		{active}
	>
		<p>{getPageTitle($_)}</p>
		<svelte:fragment slot="children">
			{#each subroutes as sub}
				<svelte:self
					{...sub}
					pageUrls={pageUrls[name]}
				/>
			{/each}
		</svelte:fragment>
	</SidebarNavTreeItem>
{:else}
	<SidebarNavItem
		{icon}
		{href}
		{active}
	>
		<p>{getPageTitle($_)}</p>
	</SidebarNavItem>
{/if}
