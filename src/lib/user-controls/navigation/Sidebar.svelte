<script>
	import {SidebarNavItem, Sidebar} from "@keenmate/svelte-adminlte"
	import {Pages} from "../../pages"
	import SidebarNavTree from "./SidebarNavTree.svelte"
	import BrandImage from "../../components/common/BrandImage.svelte"
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
		{#if !page.hide}
			{#if page.nesting}
				<SidebarNavTree icon={page.icon} href="#{page.url}">
					{page.title}
					<svelte:fragment slot="children">
						{#each page.subroutes as sub}
							<SidebarNavItem icon={sub.icon} href="#{sub.url}">
								<p>{sub.title}</p>
							</SidebarNavItem>
						{/each}
					</svelte:fragment>
				</SidebarNavTree>
			{:else}
				<SidebarNavItem icon={page.icon} href="#{page.url}">
					<p>{page.title}</p>
				</SidebarNavItem>
			{/if}
		{/if}
	{/each}
</Sidebar>
