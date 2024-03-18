<script lang="ts">
	import {location} from "svelte-spa-router"
	import {_} from "svelte-i18n"
	import {SidebarNavItem} from "@keenmate/svelte-adminlte"
	import SidebarNavTreeItem from "$lib/components/common/navigation/SidebarNavTreeItem.svelte"
	import {pageHref} from "@keenmate/js-common-helpers/helpers/url.js"
	import {pageIsActive} from "$lib/helpers/page-helpers.js"
	import type {Nullable} from "@keenmate/js-common-helpers/types/helpers.js"
	import type {Requirements} from "@keenmate/js-common-helpers/helpers/permissions.js"
	import type {Page, PageUrlsDict, TranslationText} from "$lib/pages/pages"
	
	// page
	export let name: string
	export let icon: Nullable<string> = null
	export let image: Nullable<string> = null
	export let alt: Nullable<string> = null
	export let title: Nullable<string | ((i18n: (key: string) => string) => string)> = null
	export let nesting = false
	export let subroutes: Page[] = []
	export let hide = false

	// to hide warnings

	// svelte-ignore unused-export-let
	export let requirements: Requirements = {}
	// svelte-ignore unused-export-let
	export let anyNestedRequirements: boolean = false
	// svelte-ignore unused-export-let
	export let url: Nullable<string> = null
	// svelte-ignore unused-export-let
	export let breadcrumb: Nullable<TranslationText[]> = null
	// svelte-ignore unused-export-let
	export let target = null

	// common
	export let pageUrls: PageUrlsDict

	let active: boolean
	let href: Nullable<string>

	$: active = pageIsActive($location, name)
	$: href = (!nesting && pageHref(pageUrls[name], {}, {})) || null

	function getPageTitle(i18n: any) {
		return (typeof title === "function" && title(i18n)) || title || i18n("routes." + name + ".title")
	}
</script>

{#if !hide}
	{#if nesting}
		<SidebarNavTreeItem {icon} {active}>
			<p>{getPageTitle($_)}</p>
			<svelte:fragment slot="children">
				{#each subroutes as sub}
					<svelte:self {...sub} pageUrls={pageUrls[name]} />
				{/each}
			</svelte:fragment>
		</SidebarNavTreeItem>
	{:else}
		<SidebarNavItem {icon} {href} {active}>
			<svelte:fragment slot="icon">
				{#if image}
					{#await import(`../../../../assets/images/icons/${image}.svg`) then imgSrc}
						<img src={imgSrc.default} {alt} />
					{/await}
				{/if}
			</svelte:fragment>

			<p>{getPageTitle($_)}</p>
		</SidebarNavItem>
	{/if}
{/if}
