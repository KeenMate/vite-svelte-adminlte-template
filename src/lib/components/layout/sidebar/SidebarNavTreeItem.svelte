<!-- @migration-task Error while migrating Svelte code: Identifier 'children' has already been declared
https://svelte.dev/e/js_parse_error -->
<script lang="ts">
	import {preventDefault} from "svelte/legacy"

	import {onMount} from "svelte"

	type Props = {
		href?: string;
		iconClass: any;
		active?: boolean;
		locationReplace?: boolean;
		children?: import("svelte").Snippet;
		items?: import("svelte").Snippet;
	}

	let {
		    href            = "",
		    iconClass,
		    active          = false,
		    locationReplace = false,
		    children        = undefined,
		    items,
	    }: Props = $props()

	let opened = $state(false)

	onMount(() => {
		opened = active && !opened ? true : opened
	})

	function navigateTo() {
		opened = !opened
		if (!href) {
			return
		}
		if (locationReplace) {
			window.location.replace(href)
		} else {
			window.location.href = href
		}
	}
</script>

<li class="nav-item" class:menu-open={opened}>
	<!--{href}-->
	<a
		class="nav-link"
		class:active
		onclick={preventDefault(navigateTo)}
	>
		{#if iconClass}
			<i class="nav-icon {iconClass}"></i>
		{/if}
		<p>
			{@render children?.()}
			<i class="right fas fa-angle-left icon fa-fw"></i>
		</p>
	</a>
	<ul class="nav nav-treeview ml-2">
		{@render items?.()}
	</ul>
</li>

<style lang="scss">
	.sidebar-collapsed .icon {
		display: none;
	}

	.nav-item {
		cursor: pointer;
	}
</style>
