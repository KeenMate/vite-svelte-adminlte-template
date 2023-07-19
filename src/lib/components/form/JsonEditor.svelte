<script>
	import {createEventDispatcher, onDestroy, onMount} from "svelte"
	import JsonEditor from "jsoneditor"
	import "jsoneditor/dist/jsoneditor.min.css"

	const dispatch = createEventDispatcher()

	export let value
	export let options

	let element
	let instance

	$: instance && value && instance.set(value)

	onMount(() => {
		instance = new JsonEditor(element, {
			onChangeJSON(json) {
				dispatch("change", json)
			},
			...options,
		}, value)
	})

	onDestroy(() => {
		if (instance)
			instance.destroy()
	})
</script>

<div bind:this={element}></div>
