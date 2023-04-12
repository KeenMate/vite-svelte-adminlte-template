export function joinPaths(...paths) {
	const separator = "/"
	const result = []

	for (let i = 0; i < paths.length; i++) {
		const sanitized = paths[i]?.toString() ?? ""
		if (!i)
			result.push(trimEnd(sanitized, separator))
		else if (i === paths.length - 1)
			result.push(trimStart(sanitized, separator))
		else
			result.push(trim(sanitized, separator))
	}

	return result.join(separator)
}

export function trim(string, character) {
	if (!character)
		return string.trim()

	return trimEnd(trimStart(string, character), character)
}

export function trimStart(string, character) {
	if (!character)
		return string.trimStart()

	return string.replace(new RegExp(`^${character}+`), "")
}

export function trimEnd(string, character) {
	if (!character)
		return string.trimEnd()

	return string.replace(new RegExp(`${character}+$`), "")
}

export function getRandomString(length) {
	let randomNumbers = []

	for (let i = 0; i < length; i++)
		randomNumbers.push(getRandomCharCode())

	return String.fromCharCode(...randomNumbers)
}

export function capitalize([first, ...rest]) {
	return first.toLocaleUpperCase() + rest.join("")
}

export function removeDiacritics(str) {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function htmlToText(html) {
	const div = document.createElement("div")
	div.innerHTML = html
	div.innerHTML = div.innerHTML.replace("<br>", "\n")

	return div.innerText
}

export function wordlist(str) {
	return str.split(" ")
}

function getRandomCharCode() {
	return 65 + Math.round(Math.random() * 25)
}
