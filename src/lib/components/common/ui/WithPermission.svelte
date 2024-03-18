<script>
	import {checkPermissions} from "@keenmate/js-common-helpers/helpers/permissions"
	import {CurrentUser} from "$lib/stores/authentication.ts"

	export let permission
	export let comparison = "any"

	$: sanitizedPermission =
		(typeof permission === "string" && [permission]) || permission
	$: isVisible = checkPermissions($CurrentUser?.permissions, {
		[comparison]: sanitizedPermission
	})
</script>

{#if isVisible}
	<slot />
{/if}
