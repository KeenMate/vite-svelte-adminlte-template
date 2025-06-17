<table class="table-fixed {$$restProps.class || ''}">
	<tr>
		<td>
			<slot></slot>
		</td>
	</tr>
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
