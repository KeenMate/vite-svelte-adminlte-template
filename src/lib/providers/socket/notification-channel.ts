import {
  Channel,
  pushSocketMessageAsync
} from "@keenmate/js-common-helpers/socket/channel"
import Messages from "../../streams/messages.js"
import socket from "./index.js"
import {PushResponse} from "$lib/types/channel-types.js"

export const NotificationsChannel = new Channel(socket, "notifications:lobby")

export async function searchNotificationsAsync(filters, pagination) {
  const channel = await NotificationsChannel.getAsync()

  const response = await pushSocketMessageAsync<PushResponse>(
    channel,
    "search",
    {
      filters,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
  )

  return response.data
}

export async function getLatestNotificationsAsync() {
  const channel = await NotificationsChannel.getAsync()

  const response = await pushSocketMessageAsync<PushResponse>(
    channel,
    "get_latest"
  )
  return response.data
}

export async function getNotificationFilesAsync(id) {
  const channel = await NotificationsChannel.getAsync()

  const response = await pushSocketMessageAsync<PushResponse>(
    channel,
    "get_notification_files",
    {id}
  )
  return response.data
}

export async function getNotificationTypesAsync() {
  const channel = await NotificationsChannel.getAsync()

  return await pushSocketMessageAsync<PushResponse>(
    channel,
    "get_notification_types"
  )
}

export async function getNotificationLevelsAsync() {
  const channel = await NotificationsChannel.getAsync()

  const response = await pushSocketMessageAsync<PushResponse>(
    channel,
    "get_notification_levels"
  )
  return response.data
}

export async function deleteNotificationAsync(id) {
  const channel = await NotificationsChannel.getAsync()

  const response = await pushSocketMessageAsync<PushResponse>(
    channel,
    "delete",
    {id}
  )
  return response.data
}

export async function updateUserLastSeenNotificationAsync(id) {
  const channel = await NotificationsChannel.getAsync()

  const response = await pushSocketMessageAsync<PushResponse>(
    channel,
    "update_last_seen_notification",
    {id}
  )

  return response.data
}
