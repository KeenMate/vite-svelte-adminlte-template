<script lang="ts">
	import {link, location} from "@keenmate/svelte-spa-router"
	import {_} from "svelte-i18n"
	import {SidebarNavItem} from "@keenmate/svelte-adminlte"
	import SidebarNavTreeItem from "$lib/components/layout/sidebar/SidebarNavTreeItem.svelte"
	import {pageHref, pageUrl} from "@keenmate/js-common-helpers/helpers/url.js"
	import {isPageActive} from "$lib/helpers/page-helpers.js"
	import type {Requirements} from "@keenmate/js-common-helpers/helpers/permissions.js"
	import type {Page, PageUrlsDict, TranslationText} from "$lib/pages/pages.js"
	// page
	export let name: string
	export let icon: string | null = null
	export let image: string | null = null
	export let alt: string | null = null
	export let title: string | ((i18n: (key: string) => string) => string) = null
	export let nesting = false
	export let subroutes: Page[] = []
	export let hide = false

	// to hide warnings

	// svelte-ignore unused-export-let
	export let requirements: Requirements = {}
	// svelte-ignore unused-export-let
	export let anyNestedRequirements: boolean = false
	// svelte-ignore unused-export-let
	export let url: string | null = null
	// svelte-ignore unused-export-let
	export let breadcrumb: TranslationText[] | null = null
	// svelte-ignore unused-export-let
	export let target = null

	// common
	export let pageUrls: PageUrlsDict

	let active: boolean
	let href: string | null

	$: active = isPageActive($location, name)
	$: href = (!nesting && pageUrl(pageUrls[name], {}, {})) || null

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
		<SidebarNavItem {icon} {active} use={el => link(el, {href})}>
<!--			<svelte:fragment slot="icon">-->
<!--				{#if image}-->
<!--					{#await import(`../../../../assets/images/icons/${image}.svg`) then imgSrc}-->
<!--						<img src={imgSrc.default} {alt} />-->
<!--					{/await}-->
<!--				{/if}-->
<!--			</svelte:fragment>-->

			<p>{getPageTitle($_)}</p>
		</SidebarNavItem>
	{/if}
{/if}
