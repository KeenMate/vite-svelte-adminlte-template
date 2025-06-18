import {
	Channel,
	pushSocketMessageAsync
} from "@keenmate/js-common-helpers/socket/channel.js"
import Messages from "../../streams/messages.js"
import socket, {savePushAsync} from "./index.js"

export const NotificationsChannel = new Channel(socket, "notifications:lobby")

export async function searchNotificationsAsync(filters, pagination) {
	return await savePushAsync(NotificationsChannel, "search", {
		filters,
		page:     pagination.page,
		pageSize: pagination.pageSize
	})
}

export async function getLatestNotificationsAsync() {
	return await savePushAsync(NotificationsChannel, "get_latest", {})
}

export async function getNotificationFilesAsync(id: number) {
	return await savePushAsync(NotificationsChannel, "get_notification_files", {
		id
	})
}

export async function getNotificationTypesAsync() {
	return await savePushAsync(NotificationsChannel, "get_notification_types", {})
}

export async function getNotificationLevelsAsync() {
	return await savePushAsync(
		NotificationsChannel,
		"get_notification_levels",
		{}
	)
}

export async function deleteNotificationAsync(id: number) {
	return await savePushAsync(NotificationsChannel, "delete", {id})
}

export async function updateUserLastSeenNotificationAsync(id) {
	return await savePushAsync(
		NotificationsChannel,
		"update_last_seen_notification",
		{id}
	)
}
