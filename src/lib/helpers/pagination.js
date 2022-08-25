export default function parsePagination(parsedQuerystring) {
	const page = parsedQuerystring.page && Number(parsedQuerystring.page) || 1
	const pageSize = parsedQuerystring.pageSize && Number(parsedQuerystring.pageSize) || 30

	return {
		page,
		pageSize
	}
}
