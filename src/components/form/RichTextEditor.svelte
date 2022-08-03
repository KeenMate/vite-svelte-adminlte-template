<script>
	// import {CkEditor} from "svelte-adminlte"
	import FroalaEditor from "./editors/FroalaEditor.svelte"
	// import QuillEditor from "./editors/QuillEditor.svelte"

	export let theme = "snow"
	/**
	 * @type {"quill" | "froala" | "ck-editor"}
	 */
	export let type
	export let setValue
	export let getValue

	$: editorComponent = getEditorComponent(type)

	function getEditorComponent(type) {
		switch (type) {
			// case "quill":
			// 	return QuillEditor
			case "froala":
				return FroalaEditor
			// case "ck-editor":
			// 	return CkEditor
			default:
				throw new Error("Unsupported editor type: " + type)
		}
	}
</script>

<svelte:component
	this={editorComponent}
	bind:setValue
	bind:getValue
	{...$$restProps}
	on:input
/>
