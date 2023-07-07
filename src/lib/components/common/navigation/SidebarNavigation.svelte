<script>
	import {PageUrls} from "$lib/pages/index.js"
	import {Sidebar} from "@keenmate/svelte-adminlte"
	import {Pages} from "../../../pages"
	import SidebarStaticNavItem from "$lib/components/common/navigation/SidebarStaticNavItem.svelte"
	import SidebarPageNavItem from "$lib/components/common/navigation/SidebarPageNavItem.svelte"
</script>

<Sidebar color="dark-dhl-yellow">
	<svelte:fragment slot="header">
		<a class="brand-link d-flex" data-widget="pushmenu" role="button">
			<i class="fas fa-bars fa-fw" />
		</a>
	</svelte:fragment>

	{#each Pages as page}
		{#if page.type === "static"}
			<SidebarStaticNavItem {...page} pageUrls={PageUrls} />
		{:else}
			<SidebarPageNavItem {...page} pageUrls={PageUrls} />
		{/if}
	{/each}
</Sidebar>

<style lang="scss">
	:global {
		//body.sidebar-collapse {
		//	[data-widget="pushmenu"] {
		//		justify-content: center;
		//	}
		//
		//	.main-sidebar {
		//		&:hover {
		//			[data-widget="pushmenu"] {
		//				justify-content: start !important;
		//			}
		//		}
		//	}
		//}

		.main-sidebar {
			[data-widget="pushmenu"] {
				justify-content: start;
				padding: 0.9rem 1.5rem;
			}
		}
	}
</style>
