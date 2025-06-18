<script lang="ts">
	import {run} from "svelte/legacy"

	import {onDestroy, onMount} from "svelte"
	import {_} from "svelte-i18n"
	import {
		DateRangePicker,
		NotificationProvider,
		NumberInput,
		PageHeader
	} from "@keenmate/svelte-adminlte"
	import {
		setCustomPageTitle,
		customPageTitleUsed
	} from "$lib/stores/page-title.js"
	import {
		ExampleChannel,
		ItemType,
		getItemsAsync
	} from "$lib/providers/socket/example-channel.js"

	let items: ItemType[] = $state([])
	let id                = $state(5)

	onMount(async () => {
		ExampleChannel.join()
		customPageTitleUsed.set(true)
		setCustomPageTitle("Loading...")
		setTimeout(() => {
			setCustomPageTitle("Custom Page 1")
		}, 1000)
	})

	async function loadItemsASync(id) {
		try {
			items = await getItemsAsync(id)
		} catch (e) {
			console.error(e)
			NotificationProvider.error("Error loading items")
			items = []
		}
	}

	onDestroy(() => {
		customPageTitleUsed.set(false)
	})

	$effect(() => {
		loadItemsASync(id)
	})
</script>

<p>Page1 content</p>
<NumberInput bind:value={id} max="100" />
<ul>
	{#each items as item}
		<li>
			({item.id}) {item.name}
		</li>
	{/each}
</ul>
