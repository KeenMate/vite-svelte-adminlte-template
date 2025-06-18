export function joinPaths(...paths: string[]) {
	const separator = "/"
	const result    = []

	for (let i = 0; i < paths.length; i++) {
		const sanitized = paths[i]?.toString() ?? ""
		if (!i) {
			result.push(trimEnd(sanitized, separator))
		} else if (i === paths.length - 1) {
			result.push(trimStart(sanitized, separator))
		} else {
			result.push(trim(sanitized, separator))
		}
	}

	return result.join(separator)
}

export function trim(str: string, character: string) {
	if (!character) {
		return str.trim()
	}

	return trimEnd(trimStart(str, character), character)
}

export function trimStart(str: string, character: string) {
	if (!character) {
		return str.trimStart()
	}

	return str.replace(new RegExp(`^${character}+`), "")
}

export function trimEnd(str: string, character: string) {
	if (!character) {
		return str.trimEnd()
	}

	return str.replace(new RegExp(`${character}+$`), "")
}

export function getRandomString(length: number) {
	let randomNumbers = []

	for (let i = 0; i < length; i++) {
		randomNumbers.push(getRandomCharCode())
	}

	return String.fromCharCode(...randomNumbers)
}

export function capitalize([first, ...rest]: string) {
	return first.toLocaleUpperCase() + rest.join("")
}

export function removeDiacritics(str: string) {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function htmlToText(html: string) {
	const div     = document.createElement("div")
	div.innerHTML = html
	div.innerHTML = div.innerHTML.replace("<br>", "\n")

	return div.innerText
}

export function wordlist(str: string) {
	return str.split(" ")
}

export function toSnakeCase(str: string) {
	return str.replace(/([a-z])([A-Z])/g, "$1_$2")
		.toLocaleLowerCase()
}

function getRandomCharCode() {
	return 65 + Math.round(Math.random() * 25)
}
