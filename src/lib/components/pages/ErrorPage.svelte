<script lang="ts">
	import {_} from "svelte-i18n"
	import {LteButton} from "@keenmate/svelte-adminlte"

	export let errorNumber: string | number = 500
</script>

<div class="error-page">
	<h2 class="headline text-warning">
		{errorNumber || "500"}
	</h2>

	<div class="error-content">
		<h3>
			<i class="fas fa-exclamation-triangle text-warning"></i>
			<slot>
				{#if errorNumber === 404}
					{$_("common.messages.notFoundError")}
				{:else}
					{$_("common.messages.internalServerError")}
				{/if}
			</slot>
		</h3>

		<p>
			<slot name="message">
				{#if window.history.length > 1}
					<LteButton color="info" small on:click={() => window.history.back()}>
						{$_("common.buttons.back")}
					</LteButton>
				{/if}
			</slot>
		</p>
	</div>
</div>
