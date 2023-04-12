<script>
	import {onDestroy, onMount} from "svelte"
	import {_} from "svelte-i18n"
	import {PageHeader} from "@keenmate/svelte-adminlte"
	import {setCustomPageTitle, customPageTitleUsed} from "../stores/page-title"

	onMount(() => {
		customPageTitleUsed.set(true)
		setCustomPageTitle("Loading...")
		setTimeout(() => {
			setCustomPageTitle("Custom Page 1")
		}, 1000)
	})

	onDestroy(() => {
		customPageTitleUsed.set(false)
	})
</script>

<PageHeader>
	{$_("page1.title")}
</PageHeader>

<p>
	Page1 content
</p>
