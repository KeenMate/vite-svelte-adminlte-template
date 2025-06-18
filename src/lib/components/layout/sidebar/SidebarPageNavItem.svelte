<!-- @migration-task Error while migrating Svelte code: Cannot use explicit children snippet at the same time as implicit children content. Remove either the non-whitespace content or the children snippet block
https://svelte.dev/e/snippet_conflict -->
<script lang="ts">
	import SidebarPageNavItem from "./SidebarPageNavItem.svelte"
	import {link, location} from "@keenmate/svelte-spa-router"
	import {_} from "svelte-i18n"
	import {SidebarNavItem} from "@keenmate/svelte-adminlte"
	import SidebarNavTreeItem from "$lib/components/layout/sidebar/SidebarNavTreeItem.svelte"
	import {pageHref, pageUrl} from "@keenmate/js-common-helpers/helpers/url.js"
	import {isPageActive} from "$lib/helpers/page-helpers.js"
	import type {Requirements} from "@keenmate/js-common-helpers/helpers/permissions.js"
	import type {Page, PageUrlsDict, TranslationText} from "$lib/pages/pages.js"

	type Props = {
		// page
		name: string;
		icon?: string | null;
		image?: string | null;
		alt?: string | null;
		title?: string | ((i18n: (key: string) => string) => string);
		nesting?: boolean;
		subroutes?: Page[];
		hide?: boolean;
		// svelte-ignore unused-export-let
		requirements?: Requirements;
		// svelte-ignore unused-export-let
		anyNestedRequirements?: boolean;
		// svelte-ignore unused-export-let
		url?: string | null;
		// svelte-ignore unused-export-let
		breadcrumb?: TranslationText[] | null;
		// svelte-ignore unused-export-let
		target?: any;
		// common
		pageUrls: PageUrlsDict;
	}

	let {
		    name,
		    icon                  = undefined,
		    image                 = undefined,
		    alt                   = undefined,
		    title                 = undefined,
		    nesting               = false,
		    subroutes             = [],
		    hide                  = false,
		    requirements          = {},
		    anyNestedRequirements = false,
		    url                   = undefined,
		    breadcrumb            = undefined,
		    target                = undefined,
		    pageUrls
	    }: Props = $props()

	let active: boolean     = $derived(isPageActive($location, name))
	let href: string | null = $derived((!nesting && pageUrl(pageUrls[name], {}, {})) || null)
	
	function getPageTitle(i18n: any) {
		return (typeof title === "function" && title(i18n)) || title || i18n("routes." + name + ".title")
	}
</script>

{#if !hide}
	{#if nesting}
		<SidebarNavTreeItem iconClass={icon} {active}>
			<p>{getPageTitle($_)}</p>

			{#snippet items()}
				{#each subroutes as sub}
					<SidebarPageNavItem {...sub} pageUrls={pageUrls[name]} />
				{/each}
			{/snippet}
		</SidebarNavTreeItem>
	{:else}
		<SidebarNavItem iconClass={icon} {active} use={el => link(el, {href})}>
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
