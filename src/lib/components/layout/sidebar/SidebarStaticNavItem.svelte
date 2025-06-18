<script lang="ts">
	import {isPageActive} from "$lib/helpers/page-helpers.js"
	import {location} from "@keenmate/svelte-spa-router"
	import {_} from "svelte-i18n"
	import {Config, SidebarNavItem} from "@keenmate/svelte-adminlte"
	import {type Requirements} from "@keenmate/js-common-helpers/helpers/permissions.js"
	import {CurrentUser} from "$lib/stores/authentication.js"
	import type {PageUrlsDict} from "$lib/pages/pages.js"


	type Props = {
		// page
		name: string;
		icon: string;
		title?: string | ((i18n: (key: string) => string) => string);
		hide?: boolean;
		target?: string | null;
		requirements?: Requirements;
		// common
		pageUrls: PageUrlsDict;
	}

	let {
		    name,
		    icon,
		    title        = undefined,
		    hide         = false,
		    target       = undefined,
		    requirements = {},
		    pageUrls
	    }: Props = $props()

	let hasPermissions: boolean = $derived($Config.permissions.checkPermissions($CurrentUser, requirements)),
	    active: boolean = $derived(hasPermissions && isPageActive($location, name)),
	    href: string = $derived(hasPermissions && pageUrls[name])


	function getPageTitle(i18n: any) {
		return (typeof title === "function" && title(i18n)) || title || i18n("routes." + name + ".title")
	}
</script>

{#if hasPermissions && !hide}
	<SidebarNavItem {icon} {href} {active} {target}>
		<p>{getPageTitle($_)}</p>
	</SidebarNavItem>
{/if}
