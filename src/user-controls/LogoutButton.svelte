<script>
	import {getContext} from "svelte"
	import {
		OIDC_CONTEXT_CLIENT_PROMISE,
		OIDC_CONTEXT_POST_LOGOUT_REDIRECT_URI,
		logout
	} from "@dopry/svelte-oidc/src/components/OidcContext.svelte"

	import {DropdownItem} from "svelte-adminlte"

	const oidcPromise = getContext(OIDC_CONTEXT_CLIENT_PROMISE)
	export let logout_url = getContext(OIDC_CONTEXT_POST_LOGOUT_REDIRECT_URI)
</script>

<DropdownItem href="#" on:click={() => logout(oidcPromise, logout_url)}>
	<slot />
</DropdownItem>
