<script lang="ts">

	export let checked = false
</script>

<span class="gadget-option">
	<i
		class="far"
		class:fa-check-square={checked}
		class:fa-square={!checked}
	></i>

	<slot />
</span>
