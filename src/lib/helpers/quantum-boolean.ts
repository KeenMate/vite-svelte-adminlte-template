export function parseQuantumBooleanQueryValue(value: "true" | "false" | "null" | undefined, defaultValue?: boolean): boolean | undefined {
	return value === "null"
		? undefined
		: value === undefined
			? defaultValue
			: value === "true"
}

export function stringifyQuantumBooleanQueryValue(value: boolean | undefined): string {
	return value === undefined
		? "null"
		: value?.toString()
}
