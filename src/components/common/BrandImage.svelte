<img
	src="/images/DHL_logo_rgb.svg"
	alt="DHL Logo"
	class="brand-image d-none d-md-block {$$restProps.class || ''}"
/>
<img
	src="/images/dhl_responsive_logo_rgb.svg"
	alt="DHL Logo"
	class="brand-image brand-image-responsive {$$restProps.class || ''}"
/>

<style lang="sass">
	:global
		.sidebar-mini
			.brand-image
				display: block !important
			.brand-image-responsive
				display: none !important

		.sidebar-mini.sidebar-collapse
			.brand-image
				display: none !important
			.brand-image-responsive
				display: block !important

	img
		position: relative
		top: -1px

		&.brand-image-responsive
			margin-left: 0
			margin-right: .6rem
</style>
