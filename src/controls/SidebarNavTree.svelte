<script>
    export let href = "#"
    export let icon
  </script>

<li class="nav-item">
	<a {href} class="nav-link">
		{#if icon}
			<i class="nav-icon {icon}" />
		{/if}
		<p>
			<slot />
			<i class="right fas fa-angle-left icon"></i>
		</p>
	</a>
	<ul class="nav nav-treeview margin">
		<slot name="children"></slot>
	</ul>
</li>

<style lang="sass">
	// .margin
	//   margin-left: 0.5em
		:global

	.sidebar-collapsed .icon
		display: none


</style>
