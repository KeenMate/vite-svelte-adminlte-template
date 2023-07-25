import {
  Channel,
  pushSocketMessageAsync as pushAsync
} from "@keenmate/js-common-helpers/socket/channel"
import socket from "./index.js"

export const ExampleChannel = new Channel(socket, "notifications:lobby")

export async function getItemsAsync(id) {
  const channel = await ExampleChannel.getAsync()

  return (await pushAsync(channel, "get_items", {
    id
  })) as any[]
}
