import {DateTime, Duration} from "luxon"
import {DisplayDateFormat, DisplayDateTimeFormat, DisplayDurationFormat} from "../constants/date"

export function formatDateTime(datetime) {
	return formatDate(datetime, DisplayDateTimeFormat)
}

export function formatDate(datetime, format = DisplayDateFormat) {
	if (!datetime)
		return ""
	datetime = typeof datetime === "string" ? DateTime.fromISO(datetime) : datetime

	return datetime.toFormat(format)
}

export function formatDuration(duration) {
	if (!duration)
		return ""

	return Duration
		.fromISOTime(duration)
		.toFormat(DisplayDurationFormat)
}
