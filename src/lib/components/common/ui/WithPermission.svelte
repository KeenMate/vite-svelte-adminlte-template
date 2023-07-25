<script>
	import {checkPermissions} from "@keenmate/js-common-helpers/helpers/permissions"
	import {currentUser} from "$lib/stores/authentication.js"

	export let permission
	export let comparison = "any"

	$: sanitizedPermission =
		(typeof permission === "string" && [permission]) || permission
	$: isVisible = checkPermissions($currentUser?.permissions, {
		[comparison]: sanitizedPermission
	})
</script>

{#if isVisible}
	<slot />
{/if}
