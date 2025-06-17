<script lang="ts">
	import {onMount} from "svelte"

	export let href = ""
	export let icon
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
	<!--{href}-->
	<a
		class="nav-link"
		class:active
		on:click|preventDefault={navigateTo}
	>
		{#if icon}
			<i class="nav-icon {icon}" />
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

<style lang="scss">
	.sidebar-collapsed .icon {
		display: none;
	}

	.nav-item {
		cursor: pointer;
	}
</style>
