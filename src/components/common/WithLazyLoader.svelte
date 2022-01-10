<script>
	import lazyLoader from "../../helpers/lazy-loader"
	import {emptyPromise} from "../../helpers/promise-helpers"
	import {Loader} from "svelte-adminlte"

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
			<div class="loader-parent">
				<div>
					<Loader />
				</div>
			</div>
		</slot>
	{:else}
		<slot data={oldData} />
	{/if}
{:then data}
	<slot {data} />
{:catch error}
	<slot name="catch" {error} />
{/await}

<style lang="sass">
	@import "../../assets/css/loader-parent"
</style>