<script>
	import {PageUrls} from "$lib/pages/index.js"
	import {Sidebar} from "@keenmate/svelte-adminlte"
	import {Pages} from "../../../pages"
	import SidebarStaticNavItem from "$lib/components/common/navigation/SidebarStaticNavItem.svelte"
	import SidebarPageNavItem from "$lib/components/common/navigation/SidebarPageNavItem.svelte"
	import BrandImage from "$lib/components/ui/BrandImage.svelte"
</script>

<Sidebar color="dark-dhl-yellow">
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
		{#if page.type === "static"}
			<SidebarStaticNavItem {...page} pageUrls={PageUrls} />
		{:else}
			<SidebarPageNavItem {...page} pageUrls={PageUrls} />
		{/if}
	{/each}
</Sidebar>

<style lang="scss">
	:global {
		.main-sidebar {
			[data-widget="pushmenu"] {
				justify-content: start;
				padding: 0.9rem 1.5rem;
			}
		}
	}
</style>
