<script lang="ts">
	type Props = {
		children?: import("svelte").Snippet;
		[key: string]: any
	}

	let {children = undefined, ...rest}: Props = $props()
</script>

<table class="table-fixed {rest.class || ''}">
	<tbody>
	<tr>
		<td>
			{@render children?.()}
		</td>
	</tr>
	</tbody>
</table>

<style lang="scss">
	.table-fixed {
		table-layout: fixed;
		width: 100%;

		& > tr:first-child {
			&:hover {
				background-color: transparent !important;
			}

			& > td:first-child {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding: 0 !important;
			}
		}
	}
</style>
