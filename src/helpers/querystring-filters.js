import {parse, stringify} from "qs"

export function stringifyFilters(filters, partial, mapper = (x => x)) {
	let effectiveFilters = partial
		? {
			...filters,
			...partial
		}
		: filters

	const mappedFilters = mapper(effectiveFilters)

	Object.keys(mappedFilters)
		.forEach(key => {
			if (!mappedFilters[key])
				delete mappedFilters[key]
		})

	return stringify(mappedFilters)
}

export function parseQuerystringFilters(querystring, parser = (x => x)) {
	if (!querystring)
		return parser({})

	const qsParsed = parse(querystring)

	return parser(qsParsed)
}
