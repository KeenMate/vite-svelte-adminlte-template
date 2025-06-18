<script lang="ts">
	import {getContext} from "svelte"
	import {link} from "@keenmate/svelte-spa-router"

	type Props = {
		value: string | null;
		title?: string | null;
		queryKey: string;
		contextKey: Symbol;
	}

	let {
		    value,
		    title = undefined,
		    queryKey,
		    contextKey
	    }: Props = $props()

	const {updateFiltersUrl} = getContext(contextKey) as any
</script>

{#if value}
	<a use:link={{href: updateFiltersUrl({[queryKey]: value})}}>
		{[undefined, null].includes(title) ? title : value}
	</a>
{/if}

<!--<a href="javascript:void(0)" on:click={() => updateQuerystringPartialAsync({[queryKey]: value})}>-->
<!--	{value}-->
<!--</a>-->
