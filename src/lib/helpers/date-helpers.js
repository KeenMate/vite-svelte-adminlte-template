import {DateTime, Duration} from "luxon"
import {DisplayDateFormat, DisplayDateTimeFormat, DisplayExtendedDateTimeFormat, DisplayDurationFormat} from "$lib/constants/date"

export function formatDateTime(datetime) {
	return formatDate(datetime, DisplayDateTimeFormat)
}

export function formatExtendedDateTime(datetime) {
	return formatDate(datetime, DisplayExtendedDateTimeFormat)
}

export function formatDate(datetime, format = DisplayDateFormat) {
	if (!datetime)
		return ""
	datetime = typeof datetime === "string" ? DateTime.fromISO(datetime) : datetime

	return datetime.toFormat(format)
}

export function getDurationISO(leftISO, rightISO) {
	return DateTime.fromISO(leftISO)
		.diff(DateTime.fromISO(rightISO))
		.toISOTime()
}

export function formatDuration(duration) {
	if (!duration)
		return ""

	return Duration
		.fromISOTime(duration)
		.toFormat(DisplayDurationFormat)
}
