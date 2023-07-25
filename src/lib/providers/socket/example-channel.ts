import {
  Channel,
  pushSocketMessageAsync as pushAsync
} from "@keenmate/js-common-helpers/socket/channel"
import socket from "./index.js"
import type {PushResponse} from "$lib/types/channel-types.ts"
export const ExampleChannel = new Channel(socket, "example:lobby")
ExampleChannel.join()

export type ItemType = {
  name: string
  id: number
}
export async function getItemsAsync(id) {
  const channel = await ExampleChannel.getAsync()
  const response = await pushAsync<PushResponse<ItemType[]>>(
    channel,
    "get_items",
    {
      id
    }
  )
  return response.data
}
