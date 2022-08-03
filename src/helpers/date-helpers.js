import {DateTime, Duration} from "luxon"
import {DisplayDateTimeFormat, DisplayDurationFormat} from "../constants/date"

export function formatDateTime(datetime) {
	if (!datetime)
		return ""
	datetime = typeof datetime === "string" ? DateTime.fromISO(datetime) : datetime

	return datetime.toFormat(DisplayDateTimeFormat)
}

export function formatDuration(duration) {
	if (!duration)
		return ""

	return Duration
		.fromISOTime(duration)
		.toFormat(DisplayDurationFormat)
}
