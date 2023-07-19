export const maxFileUploadSize = 10000000 // 10M

export function getLanguages() {
	const value = document.getElementById("languages")?.value
	return value && JSON.parse(value) || null
}

export function getSocketToken() {
	return document.getElementById("socket-token")?.value
}

export function getSessionTimeout() {
	const value = document.getElementById("session-timeout")?.value
	return value && Number(value) || null
}

export function getCurrentLocale() {
	return document.getElementById("current-locale")?.value
}

export function getCurrentUser() {
	const value = document.getElementById("current-user")?.value
	return value && JSON.parse(value) || null
}
