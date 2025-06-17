<script lang="ts">
	import {formatDateTime} from "$lib/helpers/date-helpers.js"
	import {_} from "svelte-i18n"
	import type {TemplateTimestampsType} from "$lib/types/index.js"

	export let model: ({[key: string | number | symbol]: any} & TemplateTimestampsType) | null | undefined = undefined
</script>

<div class="template-timestamps-text-only">
	<div>
		{#if model?.modifiedBy}
			<span>
				<!--<strong>{$_("common.labels.modifiedBy")}:</strong>-->
				<strong>
					{model?.modifiedBy || ""}
				</strong>
			</span>
			{/if}
			{#if model?.modified}
			<span>
				{$_("common.labels.modifiedAt")}
				<strong>
					{model && formatDateTime(model.modified) || ""}
				</strong>
			</span>
			{/if}
	</div>
	{#if (model?.modifiedBy || model?.modified) && (model?.createdBy || model?.created)}
		|
	{/if}
	<div>
		{#if model?.createdBy}
			<span>
				<strong>
					{model?.createdBy || ""}
				</strong>
			</span>
			{/if}
			{#if model?.created}
			<span>
				{$_("common.labels.createdAt")}
				<strong>
					{model && formatDateTime(model.created) || ""}
				</strong>
			</span>
			{/if}
	</div>
</div>

<style lang="scss">
	.template-timestamps-text-only {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: .5rem;

		font-style: italic;
		font-size: .75rem;

		& > div {
			display: flex;
			align-items: center;
			gap: .25rem;

			& > span {
				display: flex;
				align-items: center;
				gap: .25rem;
				white-space: nowrap;
			}
		}
	}
</style>
