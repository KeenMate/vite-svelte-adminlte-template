<script>
	import {Sidebar, SidebarNavItem} from "@keenmate/svelte-adminlte"
	import {location} from "svelte-spa-router"
	import {_} from "svelte-i18n"
	import {pageIsActive, Pages} from "../../../pages"
	import {checkPermissions} from "../../../helpers/permissions-helpers"
	import currentUser from "../../../stores/current-user"
	import BrandImage from "../BrandImage.svelte"
	import SidebarNavTreeItem from "./SidebarNavTreeItem.svelte"
</script>

<Sidebar color="light-warning">
	<svelte:fragment slot="header">
		<a
			href="#/"
			class="brand-link d-flex justify-content-center is-dhl-yellow"
		>
			<BrandImage />
			<span class="brand-text font-weight-light"></span>
		</a>
	</svelte:fragment>

	{#each Pages as page}
		{#if page && !page.hide && checkPermissions($currentUser?.permissions, page.permissions)}
			{#if page.nesting}
				<SidebarNavTreeItem icon={page.icon} href="#{page.url}">
					{$_("routes." + page.name + ".title")}
					<svelte:fragment slot="children">
						{#each page.subroutes as sub}
							{#if !sub.hide && checkPermissions($currentUser?.permissions, sub.permissions)}
								<SidebarNavItem
									icon={sub.icon}
									href="#{sub.url}"
									active={pageIsActive($location, sub.name)}
								>
									<p>{$_("routes." + sub.name + ".title")}</p>
								</SidebarNavItem>
							{/if}
						{/each}
					</svelte:fragment>
				</SidebarNavTreeItem>
			{:else}
				<SidebarNavItem
					icon={page.icon}
					href="#{page.url}"
					active={pageIsActive($location, page.name)}
				>
					<p>{$_("routes." + page.name + ".title")}</p>
				</SidebarNavItem>
			{/if}
		{/if}
	{/each}
</Sidebar>
