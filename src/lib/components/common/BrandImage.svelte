<script lang="ts">
	import FullBrandImage from "~assets/images/your-logo.svg"

	type Props = {
		[key: string]: any
	}

	let {...rest}: Props = $props()
</script>

<img
	src={FullBrandImage}
	alt="Brand Logo"
	class="brand-image {rest.class || ''}"
	height="31px"
/>
<!--<img-->
<!--	src={ShortBrandImage}-->
<!--	alt="Brand Logo"-->
<!--	class="brand-image brand-image-responsive {$$restProps.class || ''}"-->
<!--	height="31px"-->
<!--/>-->

<!--<style lang="scss">-->
<!--	img {-->
<!--		position: relative;-->
<!--		top: -1px;-->

<!--		&.brand-image-responsive {-->
<!--			margin-left: 0;-->
<!--			margin-right: .6rem;-->
<!--		}-->
<!--	}-->
<!--</style>-->
