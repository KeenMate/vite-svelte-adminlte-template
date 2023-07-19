<script>
	import {checkPermissions} from "$lib/helpers/permissions-helpers.js"
	import {currentUser} from "$lib/stores/authentication.js"

	export let permission
	export let comparison = "any"

	$: sanitizedPermission = typeof permission === "string"
		&& [permission]
		|| permission
	$: isVisible = checkPermissions($currentUser?.permissions, {[comparison]: sanitizedPermission})
</script>

{#if isVisible}
	<slot></slot>
{/if}
