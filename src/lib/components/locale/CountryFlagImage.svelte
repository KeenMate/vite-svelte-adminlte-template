<script lang="ts">
	import {getFlagImagePathAsync} from "$lib/locale/i18n.js"

	export let countryCode: string
	export let alt: string | null = null
</script>

{#await getFlagImagePathAsync(countryCode) then src}
	<img {src} {alt} class="flag" />
{/await}

<style lang="scss">
	img {
		width: 1.5rem;
	}
</style>
