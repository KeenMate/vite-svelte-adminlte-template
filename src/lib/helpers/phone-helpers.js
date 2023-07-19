export function getPhonePrefix(phone) {
	const parts = phone.split(" ")

	return parts.length === 2
		? parts[0]
		: ""
}

export function infusePhonePrefixWithPhone(phonePrefix, phone) {
	return phonePrefix ? (`${phonePrefix} ${phone}`) : phone
}

export function getPrefixAndPhone(phone) {
	if (!phone) return null;

	const parts = phone.split(" ")

	return parts;
}
