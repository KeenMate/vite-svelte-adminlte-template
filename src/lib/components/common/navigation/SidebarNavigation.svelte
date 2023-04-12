<script>
	import {pageHref} from "$lib/helpers/page-helpers.js"
	import {PageUrls} from "$lib/pages/index.js"
	import {Sidebar, SidebarNavItem} from "@keenmate/svelte-adminlte"
	import {location} from "svelte-spa-router"
	import {_} from "svelte-i18n"
	import {Pages} from "../../../pages"
	import {pageIsActive} from "$lib/helpers/page-helpers"
	import {checkPermissions} from "$lib/helpers/permissions-helpers.js"
	import {currentUser} from "$lib/stores/authentication.js"
	import BrandImage from "../BrandImage.svelte"
	import SidebarNavTreeItem from "./SidebarNavTreeItem.svelte"

	function getPageTitle(i18n, page) {
		if (page.title) {
			return typeof page.title === "function"
				&& page.title(i18n)
				|| page.title
		} else
			return i18n("routes." + page.name + ".title")
	}
</script>

<Sidebar color="light-warning">
	<svelte:fragment slot="header">
		<a
			href="#/"
			class="brand-link d-flex justify-content-center"
		>
			<BrandImage />
			<span class="brand-text font-weight-light"></span>
		</a>
	</svelte:fragment>

	{#each Pages as page}
		{#if page && !page.hide && checkPermissions($currentUser?.permissions, page.permissions)}
			{#if page.nesting}
				<SidebarNavTreeItem
					icon={page.icon}
					active={pageIsActive($location, page.name)}
				>
					<p>{getPageTitle($_, page)}</p>
					<svelte:fragment slot="children">
						{#each page.subroutes as sub}
							{#if !sub.hide && checkPermissions($currentUser?.permissions, sub.permissions)}
								<SidebarNavItem
									icon={sub.icon}
									href={pageHref(PageUrls[page.name][sub.name])}
									active={pageIsActive($location, sub.name)}
								>
									{getPageTitle($_, sub)}
								</SidebarNavItem>
							{/if}
						{/each}
					</svelte:fragment>
				</SidebarNavTreeItem>
			{:else}
				<SidebarNavItem
					icon={page.icon}
					href={pageHref(page.url)}
					active={pageIsActive($location, page.name)}
				>
					<p>{getPageTitle($_, page)}</p>
				</SidebarNavItem>
			{/if}
		{/if}
	{/each}
</Sidebar>
