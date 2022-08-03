<!--<script>-->
<!--	import {onMount, createEventDispatcher, onDestroy} from "svelte"-->
<!--	import Quill from "quill"-->
<!--	// import ImageResize from "quill-image-resize-module"-->
<!--	import {DefaultToolbar} from "../../../constants/quill"-->

<!--	// Quill.register("module/imageResize", ImageResize)-->

<!--	const dispatch = createEventDispatcher()-->

<!--	export let value-->
<!--	export let theme = "snow"-->
<!--	export let options = {}-->

<!--	export function setValue(val) {-->
<!--		if (!instance)-->
<!--			return-->

<!--		if (val === instance.root.innerHTML)-->
<!--			return-->

<!--		instance.setContents(instance.clipboard.convert(val), "silent")-->
<!--	}-->

<!--	let instance-->
<!--	let element-->

<!--	$: config = {-->
<!--		theme,-->
<!--		modules: {-->
<!--			// imageResize: {},-->
<!--			toolbar: DefaultToolbar-->
<!--		},-->
<!--		...options-->
<!--	}-->
<!--	// $: onValueChange(value, instance)-->

<!--	onMount(() => {-->
<!--		instance = new Quill(element, config)-->

<!--		instance.on("editor-change", onEditorChange)-->

<!--		instance.setContents(instance.clipboard.convert(value), "silent")-->
<!--	})-->

<!--	onDestroy(() => {-->
<!--		if (!instance)-->
<!--			return-->

<!--		instance.off("editor-change", onEditorChange)-->
<!--	})-->

<!--	function onEditorChange(eventName, ...args) {-->
<!--		if (!instance)-->
<!--			return-->

<!--		if (eventName === "text-change") {-->
<!--			if (args[2] !== "user")-->
<!--				return-->

<!--			const content = instance.root.innerHTML-->
<!--			dispatch("input", content)-->
<!--			value = content-->
<!--		}-->
<!--	}-->
<!--</script>-->

<!--<div class="quill-parent {$$restProps.class || ''}">-->
<!--	<div bind:this={element}>-->
<!--	</div>-->
<!--</div>-->

<!--<style lang="sass">-->
<!--	@import "../../../../node_modules/quill/dist/quill.snow.css"-->

<!--	:global-->
<!--		.ql-editor-->
<!--			min-height: 40vh-->
<!--</style>-->
