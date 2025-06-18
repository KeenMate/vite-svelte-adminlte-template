<script lang="ts">
	import {run} from "svelte/legacy"

	import {createEventDispatcher, onDestroy, onMount} from "svelte"
	import JsonEditor from "jsoneditor"
	import "jsoneditor/dist/jsoneditor.min.css"

	const dispatch = createEventDispatcher()

	let {value, options} = $props()

	let element  = $state()
	let instance = $state()

	$effect(() => {
		instance && value && instance.set(value)
	})

	onMount(() => {
		instance = new JsonEditor(element, {
			onChangeJSON(json) {
				dispatch("change", json)
			},
			...options,
		}, value)
	})

	onDestroy(() => {
		if (instance) {
			instance.destroy()
		}
	})
</script>

<div bind:this={element}></div>
