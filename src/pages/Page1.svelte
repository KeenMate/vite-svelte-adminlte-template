<script>
  import {onMount} from "svelte"
  import {_} from "svelte-i18n"
  import {PageHeader} from "svelte-adminlte"
  import {setCustomPageTitle} from "../stores/page-title"

  onMount(() => {
		setTimeout(() => {
			setCustomPageTitle("Custom Page 1")
		}, 1000)
  })
</script>

<PageHeader>
	{$_("page1.title")}
</PageHeader>

<p>
	Page1 content
</p>
