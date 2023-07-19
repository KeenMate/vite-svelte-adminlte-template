<script>
	import {StackedBarColors} from "../../constants/stacked-bar"

	export let data
	export let withRest = false
	export let restTitle = "Other"
	export let restValue = "Other"

	let colorMap = {}

	$: dataWithRest = withRest && getDataWithRest(data) || data

	function getDataWithRest(d) {
		const percentSum = d.reduce((acc, x) => acc + x.percent, 0)
		console.log("Sum", percentSum)

		if (percentSum < 100)
			return [
				...d,
				{
					id: -1,
					title: restTitle,
					percent: 100 - percentSum,
					value: restValue,
					color: "#d9d0c9"
				}
			]

		return d
	}

	function bgColor(item) {
		const color = colorMap[item.id]
			|| item.color
			|| StackedBarColors[Math.floor(Math.random() * StackedBarColors.length)]

		colorMap[item.id] = color

		return `background-color: ${color};`
	}
</script>

{#if dataWithRest?.length}
	<div class="stacked-bar">
		<ul class="legend-stack">
			{#each dataWithRest as legendItem (legendItem.id)}
				{#if legendItem.value !== 0}
					<li
						class="series-legend"
					>
						<i style="{bgColor(legendItem)} color: #fff" class="marker-legend"></i>
						<span class="text-legend">
		          {legendItem.title}
		        </span>
					</li>
				{/if}
			{/each}
		</ul>
		<div class="wrap-stack">
			{#each dataWithRest as part (part.id)}
				{#if part.value}
					<div
						class="item-stack"
						style={bgColor(part) + 'flex-basis:' + part.percent + '%;'}
					>
						<div class="percent-stack">
			          <span class="text-stack">
			            <strong>{Math.round(part.percent)}%</strong>
			          </span>
						</div>
						<div class="label-stack">
			          <span class="text-stack">
			            <strong>{@html part.value}</strong>
			          </span>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
{:else}
	<div class="wrap-stack data-not-found">
		<span>No data to render!</span>
	</div>
{/if}

<style lang="sass">
	.stacked-bar
		display: flex
		flex-direction: column-reverse

	.wrap-stack
		display: flex
		border: none
		background-color: #ffffff

	.item-stack
		position: relative

	.item-stack:hover,
	.item-stack:focus,
	.item-stack.item-active,
	.series-legend.item-active
		opacity: 0.85

	.item-stack.item-disabled,
	.series-legend.item-disabled,
	.wrap-stack:hover .item-stack:not(:hover)
		opacity: 0.2

	.label-stack,
	.percent-stack
		position: absolute
		top: 0
		left: 0
		right: 0
		margin-left: auto
		margin-right: auto
		display: inline-block
		min-width: 5rem
		max-width: 5rem
		text-align: center
		//padding: .235rem
		color: #fff
		background-color: rgba(0, 0, 0, .85)
		border: 1px solid rgba(0, 0, 0, .75)
		border-radius: 5px
		opacity: 0
		transition: opacity .3s
		z-index: 1000

	.label-stack
		font-weight: 600
		background-color: rgba(0, 0, 0, 0)
		border-color: rgba(0, 0, 0, 0)

	.percent-stack
		position: static
		display: block
		min-width: 3rem
		max-width: 3rem
		//margin: .25rem auto
		font-weight: 600
		background-color: rgba(0, 0, 0, 0)
		border-color: rgba(0, 0, 0, 0)
		opacity: 1

	.item-stack:hover .label-stack
		opacity: 1

	.item-stack:hover .percent-stack
		opacity: 0

	.legend-stack
		display: flex
		align-items: center
		justify-content: center
		overflow: auto
		margin-top: .5rem
		margin-bottom: .5rem
		padding: 0 1rem

	.series-legend
		display: block
		width: auto
		margin: 0 .5rem
		align-items: center
		cursor: pointer
		line-height: normal

	.marker-legend
		position: relative
		left: 0
		right: 0
		top: 0
		display: inline-block
		width: 12px
		height: 12px
		margin-right: 0.3rem
		border-width: 0
		border-color: #fff
		border-radius: 2px
		cursor: pointer
		vertical-align: middle

	.text-legend
		position: relative
		font-size: .750rem
		color: #333333

</style>

