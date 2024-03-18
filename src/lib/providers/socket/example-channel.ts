import {
  Channel,
  pushSocketMessageAsync as pushAsync
} from "@keenmate/js-common-helpers/socket/channel"
import socket, {savePushAsync} from "./index.js"
export const ExampleChannel = new Channel(socket, "example:lobby")
ExampleChannel.join()

export type ItemType = {
  name: string
  id: number
}
export async function getItemsAsync(id) {
  const response = await savePushAsync<ItemType[]>(
    ExampleChannel,
    "get_items",
    {id}
  )

  return response
}
