<script lang="ts">
	import {_} from "svelte-i18n"

	let {isActive} = $props()
</script>

<div
	class="is-active-indicator is-{isActive && 'success' || 'danger'} align-self-stretch"
	title={isActive && $_("common.tooltips.rowIsActive") || $_("common.tooltips.rowIsInactive")}
>
</div>

<style lang="scss">
	.is-active-indicator {
		width: .4rem;
		//height: 100%;

		&.is-success {
			background: var(--success);
		}

		&.is-danger {
			background: var(--danger);
		}
	}
</style>
