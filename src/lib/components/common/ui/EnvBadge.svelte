<script lang="ts">
	import {SystemEnvironment} from "$lib/stores/system.js"
	import {Badge} from "@keenmate/svelte-adminlte"
</script>

<!-- todo: handle onclick and show dialog/tooltip/modal with addition settings etc. -->
{#if $SystemEnvironment?.envBadgeTitle}
	<Badge color={$SystemEnvironment?.envBadgeColor} classes="env-badge">
		{$SystemEnvironment?.envBadgeTitle}
	</Badge>
{/if}

<!--<style lang="scss">-->
<!--	:global {-->
<!--		.env-badge {-->
<!--			line-height: 1.5;-->
<!--		}-->
<!--	}-->
<!--</style>-->
