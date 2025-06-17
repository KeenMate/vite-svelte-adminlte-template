<script lang="ts">
	import {_} from "svelte-i18n"
	import BannerPage from "./BannerPage.svelte"
</script>

<BannerPage>
	<h1>{$_("common.headers.error")}</h1>
	<a href="#/">{$_("common.links.homer")}</a>
</BannerPage>
