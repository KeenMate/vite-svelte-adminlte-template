<script lang="ts">
	import {_} from "svelte-i18n"
	import {LteButton} from "@keenmate/svelte-adminlte"

	type Props = {
		errorNumber?: string | number;
		children?: import("svelte").Snippet;
		message?: import("svelte").Snippet;
	}

	let {errorNumber = 500, children = undefined, message}: Props = $props()
</script>

<div class="error-page">
	<h2 class="headline text-warning">
		{errorNumber || "500"}
	</h2>

	<div class="error-content">
		<h3>
			<i class="fas fa-exclamation-triangle text-warning"></i>
			{#if children}
				{@render children()}
			{:else}
				{#if errorNumber === 404}
					{$_("common.messages.notFoundError")}
				{:else}
					{$_("common.messages.internalServerError")}
				{/if}
			{/if}
		</h3>

		<p>
			{#if message}{@render message()}{:else}
				{#if window.history.length > 1}
					<LteButton color="info" small on:click={() => window.history.back()}>
						{$_("common.buttons.back")}
					</LteButton>
				{/if}
			{/if}
		</p>
	</div>
</div>
