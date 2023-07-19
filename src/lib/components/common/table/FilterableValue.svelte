<script>
	import {getContext} from "svelte"

	export let value
	export let title = null
	export let queryKey
	export let contextKey

	const {updateFiltersUrl} = getContext(contextKey)
</script>

{#if value}
	<a href={updateFiltersUrl({[queryKey]: value})} tabindex="-1">
		{title != undefined ? title : value}
	</a>
{/if}

<!--<a href="javascript:void(0)" on:click={() => updateQuerystringPartial({[queryKey]: value})}>-->
<!--	{value}-->
<!--</a>-->
