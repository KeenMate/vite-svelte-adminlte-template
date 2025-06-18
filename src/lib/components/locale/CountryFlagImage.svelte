<script lang="ts">
	import {getFlagImagePathAsync} from "$lib/locale/i18n.js"

	type Props = {
		countryCode: string;
		alt?: string | null;
	}

	let {countryCode, alt = null}: Props = $props()
</script>

{#await getFlagImagePathAsync(countryCode) then src}
	<img {src} {alt} class="flag" />
{/await}

<style lang="scss">
	img {
		width: 1.5rem;
	}
</style>
