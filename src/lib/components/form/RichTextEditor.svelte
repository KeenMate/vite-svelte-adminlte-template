<script lang="ts">
	// import {CkEditor} from "@keenmate/svelte-adminlte"
	import FroalaEditor from "./editors/FroalaEditor.svelte"


	type Props = {
		// import QuillEditor from "./editors/QuillEditor.svelte"
		theme?: string;
		type: "quill" | "froala" | "ck-editor";
		setValue: any;
		getValue: any;
		[key: string]: any
	}

	let {
		    theme    = "snow",
		    type,
		    setValue = $bindable(),
		    getValue = $bindable(),
		    ...rest
	    }: Props = $props()


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

	let editorComponent = $derived(getEditorComponent(type))

	const SvelteComponent = $derived(editorComponent)
</script>

<SvelteComponent
	bind:setValue
	bind:getValue
	{...rest}
	on:input
/>
