<script>
	import {onDestroy, onMount} from "svelte"
	import {_} from "svelte-i18n"
	import {
		DateRangePicker,
		NumberInput,
		PageHeader
	} from "@keenmate/svelte-adminlte"
	import {
		setCustomPageTitle,
		customPageTitleUsed
	} from "$lib/stores/page-title.js"
	import {getItemsAsync} from "$lib/providers/socket/example-channel.ts"
	let items = []
	let id = 5

	onMount(async () => {
		customPageTitleUsed.set(true)
		setCustomPageTitle("Loading...")
		setTimeout(() => {
			setCustomPageTitle("Custom Page 1")
		}, 1000)

		items = await getItemsAsync(id)
	})

	onDestroy(() => {
		customPageTitleUsed.set(false)
	})

	let pickerElement
</script>

<PageHeader>
	{$_("page1.title")}
</PageHeader>

<p>Page1 content</p>
<!-- <DateRangePicker inputElement={pickerElement}>
	<input bind:this={pickerElement} /></DateRangePicker> -->
<NumberInput bind:value={id} />
{#each items as item}
	({item.id}) {item.name}
{/each}
