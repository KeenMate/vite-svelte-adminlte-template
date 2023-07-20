<script>
	export let value = false

	/**
	 * Used to alter the rendering style of icons
	 * @type {"square" | "circle" | null}
	 */
	export let style = null
	export let noColors = false

	let icon,
		fullIconClass,
		color

	$: icon = value
		&& "fa-check"
		|| "fa-times"
	$: fullIconClass = style ? `${icon}-${style}` : icon
	$: color = noColors
		? ""
		: value
		&& "text-success"
		|| "text-danger"
</script>

<i class="fas {fullIconClass} {color} fa-fw" />
