<script>
	import {getContext} from "svelte"
	import  lazyLoader from "@keenmate/js-common-helpers/helpers/lazy-loader"
	import {emptyPromise} from "@keenmate/js-common-helpers/helpers/promise"
	import {Loader} from "@keenmate/svelte-adminlte"
	import {CardLoadingContext} from "node_modules/@keenmate/svelte-adminlte/dist/structure/Card.svelte"

	const context = getContext(CardLoadingContext)

	export let task
	export let loading = false
	export let parentLoading = false

	let oldData

	// thisi is some error with configuration
	$: lazyTask =
		// @ts-ignore
		(task && lazyLoader(task, showLoader, hideLoader)) || emptyPromise
	$: lazyTask?.then(x => {
		oldData = x
	})

	function showLoader() {
		setLoading(true)
	}

	function hideLoader() {
		setLoading(false)
	}

	function setLoading(loading_) {
		loading = loading_
		context?.setLoading(loading_)
	}
</script>

{#await lazyTask}
	{#if loading && !parentLoading}
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
