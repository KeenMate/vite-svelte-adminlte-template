<script>
	import {checkPermissions} from "../../../helpers/permissions-helpers"
	import currentUser from "../../../stores/current-user"

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
