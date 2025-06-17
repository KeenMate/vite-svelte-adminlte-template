<script lang="ts">
	import {Pages, PageUrls} from "$lib/pages/index.js"
	import {Sidebar} from "@keenmate/svelte-adminlte"
	import SidebarPageNavItem from "$lib/components/layout/sidebar/SidebarPageNavItem.svelte"
	import SidebarStaticNavItem from "$lib/components/layout/sidebar/SidebarStaticNavItem.svelte"

	// function getPageTitle(i18n, page) {
	// 	if (page.title) {
	// 		return typeof page.title === "function"
	// 			&& page.title(i18n)
	// 			|| page.title
	// 	} else
	// 		return i18n("routes." + page.name + ".title")
	// }
</script>

<Sidebar color="light-warning">
	<!--<svelte:fragment slot="header">-->
	<!--	<a-->
	<!--		href="#/"-->
	<!--		class="brand-link d-flex justify-content-center"-->
	<!--	>-->
	<!--		<BrandImage />-->
	<!--		<span class="brand-text font-weight-light"></span>-->
	<!--	</a>-->
	<!--</svelte:fragment>-->

	{#each Pages as page}
		{#if page.type === "static"}
			<SidebarStaticNavItem {...page} pageUrls={PageUrls} />
		{:else}
			<SidebarPageNavItem {...page} pageUrls={PageUrls} />
		{/if}
	{/each}
</Sidebar>
