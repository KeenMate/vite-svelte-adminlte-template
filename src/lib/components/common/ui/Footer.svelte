<script>
	import {_} from "svelte-i18n"
</script>

<footer class="main-footer">
	<img src="/images/your-app-image.svg" alt="Company logo">
	<span>
		{$_("common.footer.allRightsReserved")}
	</span>
	<a href="/data-protection" target="_blank">
		{$_("common.links.dataProtection")}
	</a>
	<div class="spacer" />
	<div class="float-right d-none d-sm-inline-block" />
</footer>

<style lang="sass">
	footer.main-footer
		display: flex
		flex-wrap: wrap
		gap: 1rem
		padding-top: .5rem
		padding-bottom: .5rem

		.spacer
			flex: 1
</style>
