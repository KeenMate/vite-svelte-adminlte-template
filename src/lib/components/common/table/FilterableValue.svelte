<script lang="ts">
	import {getContext} from "svelte"
	import {link} from "@keenmate/svelte-spa-router"

	export let value: string | null
	export let title: string | null = null
	export let queryKey: string
	export let contextKey: Symbol

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
