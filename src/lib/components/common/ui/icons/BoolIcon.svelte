<script>
	export let value = false
	export let style = null
	export let noColors = false
</script>

{#if value}
	<i
		class="fas fa-check{style ? '-' + style : ''} fa-fw"
		class:text-success={!noColors}
	/>
{:else}
	<i
		class="fas fa-times{style ? '-' + style : ''} fa-fw"
		class:text-danger={!noColors}
	/>
{/if}
