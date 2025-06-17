<script lang="ts">
	import {_} from "svelte-i18n"
	import AppVersions from "$lib/components/common/ui/AppVersions.svelte"
</script>

<footer class="main-footer">
	<img src="/images/your-app-image.svg" alt="Company logo">
	<span>
		{$_("common.footer.allRightsReserved")}
	</span>
	<a href="/data-protection" target="_blank">
		{$_("common.links.dataProtection")}
	</a>
	<div class="spacer"></div>
	<div class="float-right d-none d-sm-inline-block">
		<AppVersions />
	</div>
</footer>

<style lang="scss">
	footer.main-footer {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-left: 0 !important;

		.spacer {
			flex: 1;
		}
	}
</style>
