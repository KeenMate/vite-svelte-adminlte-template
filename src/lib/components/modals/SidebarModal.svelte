<script lang="ts">
	import {onDestroy, tick} from "svelte"
	import SuperSlide from "$lib/svelte/transitions/super-slide.js"
	import {createEventDispatcher} from "svelte"

	const dispatch = createEventDispatcher()


	type Props = {
		orientation?: "top" | "right" | "bottom" | "left" | null;
		shown?: boolean;
		targetSize?: boolean;
		alwaysVisible?: boolean;
		slideOptions?: any;
		children?: import("svelte").Snippet<[any]>;
	}

	let {
		    orientation   = undefined,
		    shown         = $bindable(false),
		    targetSize    = false,
		    alwaysVisible = false,
		    slideOptions  = undefined,
		    children
	    }: Props = $props()

	let mainContentElement = $state()

	let data = $state()


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

	let expandedOrientation = $derived((orientation
		? orientation
		: (document.dir === "rtl" ? "left" : "right")) || "right")
	let contentDimensions   = $derived(getContentDimensions(expandedOrientation))
</script>

{#if alwaysVisible || shown}
	<div
		class="sidebar-modal"
		onclick={onRootElementClick}
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
			{@render children?.({data, hideModal,})}
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

			overflow: auto;

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
