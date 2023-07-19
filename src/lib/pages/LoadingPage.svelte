<script>
	import {Loader} from "@keenmate/svelte-adminlte"
	import {_} from "svelte-i18n"
	import BannerPage from "./BannerPage.svelte"
</script>

<BannerPage>
	<h1>{$_("common.headers.loading")}</h1>
	<div>
		<Loader />
	</div>
</BannerPage>
