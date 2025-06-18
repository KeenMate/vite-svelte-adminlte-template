export default function parsePagination(query) {
	const page     = (query.page && Number(query.page)) || 1
	const pageSize = (query.pageSize && Number(query.pageSize)) || 30

	return {
		page,
		pageSize
	}
}
