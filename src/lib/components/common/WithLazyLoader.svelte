<script>
	import lazyLoader from "../../helpers/lazy-loader"
	import {emptyPromise} from "../../helpers/promise-helpers"
	import {Loader} from "@keenmate/svelte-adminlte"

	export let task
	export let loading = false

	let oldData

	$: lazyTask = task
		&& lazyLoader(task, showLoader, hideLoader)
		|| emptyPromise
	$: lazyTask?.then(x => {
		oldData = x
	})
	function showLoader() {
		loading = true
	}
	function hideLoader() {
		loading = false
	}
</script>

{#await lazyTask}
	{#if loading}
		<slot name="loader">
			<Loader />
		</slot>
	{:else}
		<slot data={oldData} />
	{/if}
{:then data}
	<slot {data} />
{:catch error}
	<slot name="catch" {error} />
{/await}
