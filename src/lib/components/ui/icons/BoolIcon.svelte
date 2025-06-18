<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<script lang="ts">
	type Props = {
		value?: boolean;
		/**
		 * @description Used to alter the rendering style of icons
		 */
		style?: "square" | "circle" | null;
		noColors?: boolean;
	}

	let {value = false, style = undefined, noColors = false}: Props = $props()

	let icon          = $derived(value
		    && "fa-check"
		    || "fa-times"),
	    fullIconClass = $derived(style ? `${icon}-${style}` : icon),
	    color         = $derived(noColors
		    ? ""
		    : value
		    && "text-success"
		    || "text-danger")
</script>

<i class="fas {fullIconClass} {color} fa-fw"></i>
