export function roundToPrecision(number: number, precision: number = 2) {
	if (!number) {
		return 0
	}

	const coefficient = Math.pow(10, precision)

	return Math.round((number + Number.EPSILON) * coefficient) / coefficient
}

export function toPercent(number: number, roundPrecision: number = 4, displayedPrecision = 2) {
	const roundedNumber  = roundToPrecision(number, roundPrecision)
	const preparedNumber = (roundedNumber * 100).toFixed(displayedPrecision)

	return `${preparedNumber}%`
}
