<script lang="ts">
	import type {Nullable} from "@keenmate/js-common-helpers/types/helpers.js"
	import {onMount} from "svelte"

	export let href = ""
	export let icon: Nullable<string> = null
	export let active = false
	export let locationReplace = false

	let opened = false

	onMount(() => {
		opened = active && !opened ? true : opened
	})

	function navigateTo() {
		opened = !opened
		if (!href) return
		if (locationReplace) window.location.replace(href)
		else window.location.href = href
	}
</script>

<li class="nav-item" class:menu-open={opened}>
	<a on:click|preventDefault={navigateTo} class="nav-link" class:active>
		{#if icon}
			<i class="nav-icon {icon} fa-fw" />
		{/if}
		<p>
			<slot />
			<i class="right fas fa-angle-left icon fa-fw" />
		</p>
	</a>
	<ul class="nav nav-treeview ml-2">
		<slot name="children" />
	</ul>
</li>

<style lang="sass">
	.sidebar-collapsed .icon
		display: none
	.nav-item
		cursor: pointer
</style>
