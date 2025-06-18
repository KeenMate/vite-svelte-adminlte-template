<script lang="ts">
	import {run} from "svelte/legacy"

	import {createEventDispatcher, onDestroy} from "svelte"
	import FroalaEditor from "froala-editor"
	import "froala-editor/js/plugins/align.min"
	import "froala-editor/css/plugins/align.min"

	import "froala-editor/js/plugins/colors.min"
	import "froala-editor/css/plugins/colors.css"

	import "froala-editor/js/plugins/font_size.min"

	import "froala-editor/js/plugins/lists.min"

	import "froala-editor/js/plugins/print.min"

	import "froala-editor/js/plugins/fullscreen.min"
	import "froala-editor/css/plugins/fullscreen.min.css"

	import "froala-editor/js/plugins/code_view.min"
	import "froala-editor/css/plugins/code_view.min.css"

	import "froala-editor/js/plugins/code_beautifier.min"

	import "froala-editor/js/plugins/inline_class.min"

	import "froala-editor/js/plugins/inline_style.min"

	import "froala-editor/js/plugins/image.min"
	import "froala-editor/css/plugins/image.min.css"

	import "froala-editor/js/plugins/link.min"

	import "froala-editor/js/plugins/table.min"
	import "froala-editor/css/plugins/table.min.css"

	import "froala-editor/js/plugins/paragraph_format.min"

	import "froala-editor/js/plugins/paragraph_style.min"

	import "froala-editor/js/plugins/quote.min"

	import "froala-editor/js/plugins/special_characters.min"
	import "froala-editor/css/plugins/special_characters.min.css"
	import {FroalaActivationKey, FroalaToolbarButtons} from "../../../constants/froala-editor"
	import {CssAttributes} from "../../../constants/html-attributes"

	const dispatch = createEventDispatcher()

	type Props = {
		value?: string;
		options?: any;
		[key: string]: any
	}

	let {value = "", options = {}, ...rest}: Props = $props()

	export function setValue(value) {
		if (!instance?.html) {
			console.log("Cannot set value because instance is not configured")
			return
		}

		instance.html.set(value)
	}

	export function getValue() {
		if (!instance?.html) {
			console.log("Cannot get value because instance is not configured")
			return
		}

		return instance.html.get()
	}

	let editorElement = $state()
	let instance


	onDestroy(() => {
		instance?.destroy()
	})

	function initEditor(el) {
		if (!el) {
			return
		}

		instance = new FroalaEditor(el, {
			key:                    FroalaActivationKey,
			heightMin:              "33vh",
			toolbarButtons:         FroalaToolbarButtons,
			scrollableContainer:    ".content-wrapper",
			pasteAllowedStyleProps: CssAttributes,
			pasteDeniedAttrs:       [],
			// fontSizeSelection: true,
			fontSizeUnit:             "rem",
			fontSize:                 ["0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5"],
			fontSizeDefaultSelection: "1",
			spellcheck:               false,
			events:                   {
				contentChanged() {
					dispatch("input", this.html.get())
				}
			},
			...options
		}, function () {
			this.html.set(value)
		})
	}

	$effect(() => {
		initEditor(editorElement)
	})
</script>

<div class="froala-editor {rest.class}">
	<div bind:this={editorElement}></div>
</div>

<style lang="sass">
	@import "../../../../node_modules/froala-editor/css/froala_editor.pkgd.min.css"
</style>
