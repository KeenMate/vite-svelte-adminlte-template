export function roundToPrecision(number, precision = 2) {
	const coefficient = Math.pow(10, precision)

	return Math.round((number + Number.EPSILON) * coefficient) / coefficient
}
