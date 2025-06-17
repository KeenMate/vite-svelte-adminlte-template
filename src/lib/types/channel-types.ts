export type PushResponse<TData = any, TMetadata = any> = {
	data: TData
	metadata: TMetadata
}

export type PagedPushResponse<TItem, TMetadata = PagedMetadata> = PushResponse<PagedItemsData<TItem>, TMetadata>

export type PagedItemsData<T> = T[]

export type PagedMetadata = {
	pages: number
	pageSize: number
	count: number
}
