<script lang="ts">
	import type {ErrorMessagesStore} from "$lib/stores/error-messages-store.js"
	import ErrorMessage from "$lib/components/common/ui/ErrorMessage.svelte"
	import {_} from "svelte-i18n"
	import {getContext, onMount} from "svelte"
	import {PageSvelteContextKey} from "$lib/constants/svelte-context-keys.js"
	import type {PageSvelteContext} from "$lib/types/index.js"
	import {derived} from "svelte/store"

	type Props = {
		errorMessages?: ErrorMessagesStore<string | any>;
		prefix?: string;
		isHtml?: boolean;
		children?: import("svelte").Snippet<[any]>;
	}

	let {
		    errorMessages = undefined,
		    prefix        = undefined,
		    isHtml        = false,
		    children
	    }: Props = $props()

	const ctx = getContext<PageSvelteContext>(PageSvelteContextKey)

	const errorMessages_ = errorMessages || ctx.errorMessages
</script>

{#each $errorMessages_ as item}
	<ErrorMessage on:closed={() => errorMessages_.removeErrorMessage(item.message)}>
		{#if children}{@render children({item,})}{:else}
			{#if isHtml}
				{@html $_((prefix ? prefix + "." : "") + item.message, item.i18nOptions)}
			{:else}
				{$_((prefix ? prefix + "." : "") + item.message, item.i18nOptions)}
			{/if}
		{/if}
	</ErrorMessage>
{/each}
