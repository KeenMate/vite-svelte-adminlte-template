export function getLanguages() {
	const value = getElementValue("languages")
	return (value && JSON.parse(value)) || null
}

export function getSocketToken() {
	return getElementValue("socket-token")
}

export function getSessionTimeout() {
	const value = getElementValue("session-timeout")
	return (value && Number(value)) || null
}

export function getCurrentLocale() {
	return getElementValue("current-locale")
}

export function getCurrentUser() {
	const value = getElementValue("current-user")
	return (value && JSON.parse(value)) || null
}

function getElementValue(id: string) {
	return (document.getElementById(id) as any)?.value
}
