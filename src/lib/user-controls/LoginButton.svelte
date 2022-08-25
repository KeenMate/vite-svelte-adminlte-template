<script>
	import {getContext} from "svelte"
	import {
		OIDC_CONTEXT_CLIENT_PROMISE,
		OIDC_CONTEXT_REDIRECT_URI,
		login
	} from "@dopry/svelte-oidc/src/components/OidcContext.svelte"
	import {DropdownItem} from "svelte-adminlte"

	const oidcPromise = getContext(OIDC_CONTEXT_CLIENT_PROMISE)
	export let callback_url = getContext(OIDC_CONTEXT_REDIRECT_URI)
	export let preserveRoute
</script>

<DropdownItem
	on:click={() => {
		login(oidcPromise, preserveRoute, callback_url);
	}}
>
	<slot />
</DropdownItem>
