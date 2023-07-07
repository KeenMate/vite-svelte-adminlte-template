<script>
	import {onDestroy, tick} from "svelte"
	import SuperSlide from "$lib/svelte/transitions/super-slide.js"
	import {createEventDispatcher} from "svelte"
	
	const dispatch = createEventDispatcher()

	/**
	 * @type {"top" | "right" | "bottom" | "left" | null}
	 * @default null
	 * @description If not specified the orientation is determined by browser's LTR/RTL setting.
	 */
	export let orientation = null
	
	export let shown = false
	export let targetSize = false
	export let alwaysVisible = false
	export let slideOptions = null

	let mainContentElement
	
	let data
	
	$: expandedOrientation = (orientation
		? orientation
		: (document.dir === "rtl" ? "left" : "right")) || "right"
	$: contentDimensions = getContentDimensions(expandedOrientation)
	
	onDestroy(() => {
		if (shown) {
			hideModal()
		}
	})
	
	export async function showModal(_data) {
		data = _data
		
		await tick()

		shown = true
	}
	
	export function hideModal() {
		shown = false
	}
	
	function getContentDimensions(orientation) {
		const targetSizeDefault = targetSize || "fit-content"
		
		switch (orientation) {
			case "top":
			case "bottom":
				return {w: "100vw", h: targetSizeDefault}
			case "left":
			case "right":
				return {w: targetSizeDefault, h: "100vh"}
			default:
				throwInvalidOrientationError(orientation)
		}
	}
	
	function throwInvalidOrientationError(orientation) {
		throw new Error(`Invalid orientation: (${orientation}) for SidebarModal`)
	}
	
	function onRootElementClick(ev) {
		if (mainContentElement.contains(ev.target)) {
			return
		}
		
		dispatch("close", {callback: hideModal})
	}
</script>

{#if alwaysVisible || shown}
	<div
    class="sidebar-modal"
    on:click={onRootElementClick}
	>
		<main
			bind:this={mainContentElement}
			class="{expandedOrientation}"
			style:--content-width={contentDimensions.w}
			style:--content-height={contentDimensions.h}
			transition:SuperSlide={{orientation: expandedOrientation, targetSize, duration: 300, ...slideOptions}}
		>
			{expandedOrientation}
			{targetSize}
			<slot
				{data}
				{hideModal}
			/>
		</main>
	</div>
{/if}

<style lang="scss">
	@import "node_modules/bootstrap/scss/functions";
	@import "node_modules/admin-lte/build/scss/bootstrap-variables";
	
	.sidebar-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 5000;
		background-color: rgba($gray-800, .25);
		
		& > main {
			width: var(--content-width);
			height: var(--content-height);
			
			background-color: #fff;
			padding: 1.5rem;
			
			position: absolute;
			
			&.left {
				left: 0;
			}
			
			&.right {
				right: 0;
			}
			
			&.top {
				top: 0;
			}
			
			&.bottom {
				bottom: 0;
			}
		}
	}
</style>
