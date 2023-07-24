import {
  Channel,
  pushSocketMessageAsync
} from "@keenmate/js-common-helpers/socket/channel"
import Messages from "../../streams/messages.js"
import socket from "./index.js"

export const NotificationsChannel = new Channel(socket, "notifications:lobby")

export async function searchNotificationsAsync(filters, pagination) {
  const channel = await NotificationsChannel.getAsync()

  return await pushSocketMessageAsync(channel, "search", {
    filters,
    page: pagination.page,
    pageSize: pagination.pageSize
  })
}

export async function getLatestNotificationsAsync() {
  const channel = await NotificationsChannel.getAsync()

  return await pushSocketMessageAsync(channel, "get_latest")
}

export async function getNotificationFilesAsync(id) {
  const channel = await NotificationsChannel.getAsync()

  return await pushSocketMessageAsync(channel, "get_notification_files", {id})
}

export async function getNotificationTypesAsync() {
  const channel = await NotificationsChannel.getAsync()

  return await pushSocketMessageAsync(channel, "get_notification_types")
}

export async function getNotificationLevelsAsync() {
  const channel = await NotificationsChannel.getAsync()

  return await pushSocketMessageAsync(channel, "get_notification_levels")
}

export async function deleteNotificationAsync(id) {
  const channel = await NotificationsChannel.getAsync()

  return await pushSocketMessageAsync(channel, "delete", {id})
}

export async function updateUserLastSeenNotificationAsync(id) {
  const channel = await NotificationsChannel.getAsync()

  return await pushSocketMessageAsync(
    channel,
    "update_last_seen_notification",
    {id}
  )
}
