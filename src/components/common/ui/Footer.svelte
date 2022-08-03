<script>
	import {_} from "svelte-i18n"
</script>

<footer class="main-footer">
	<img src="/images/DPDHL_Group_One_line_logo_rgb_black.svg" alt="">
	<span>
		<strong>Copyright © 2022 <a href="https://dhl.com">DHL</a>.</strong>
		{$_("common.footer.allRightsReserved")}
	</span>
	<a href="/data-protection" target="_blank">
		{$_("common.links.dataProtection")}
	</a>
	<div class="spacer"></div>
	<div class="float-right d-none d-sm-inline-block">
	</div>
</footer>

<style lang="sass">
	footer.main-footer
		display: flex
		flex-wrap: wrap
		gap: 1rem

		.spacer
			flex: 1
</style>
