<script lang="ts">
	import {Sidebar} from "@keenmate/svelte-adminlte"
	import {getFilteredPages, Pages, PageUrls} from "$lib/pages"
	import BrandImage from "$lib/components/ui/BrandImage.svelte"
	import SidebarPageNavItem from "$lib/components/common/navigation/SidebarPageNavItem.svelte"
	import {CurrentUser} from "$lib/stores/authentication"
</script>

<Sidebar color="is-cuni-brown">
	<svelte:fragment slot="header">
		<a href="/" class="brand-link d-flex justify-content-center is-cuni-red">
			<BrandImage />
			<span class="brand-text font-weight-light" />
		</a>
	</svelte:fragment>
	{#each getFilteredPages($CurrentUser) as page}
		<SidebarPageNavItem {...page} pageUrls={PageUrls} />
	{/each}
</Sidebar>

<style lang="scss" global>
	.main-sidebar {
		[data-widget="pushmenu"] {
			justify-content: start;
			padding: 0.9rem 1.5rem;
		}
	}
</style>
