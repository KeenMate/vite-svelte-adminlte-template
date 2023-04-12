<script>
		export let href = "javascript:void(0)"
		export let icon
		export let active = false
	</script>

<li class="nav-item" class:menu-open={active}>
	<a {href} class="nav-link" class:active>
		{#if icon}
			<i class="nav-icon {icon}"></i>
		{/if}
		<p>
			<slot />
			<i class="right fas fa-angle-left icon fa-fw"></i>
		</p>
	</a>
	<ul class="nav nav-treeview margin">
		<slot name="children"></slot>
	</ul>
</li>

<style lang="sass">
	.sidebar-collapsed .icon
		display: none
</style>
