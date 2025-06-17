import {Channel} from "@keenmate/js-common-helpers/socket/channel.js"
import Socket from "./index.js"
import type {PushResponse} from "../../types/channel-types.js"

const SomeChannel = new Channel(Socket, "some_channel:lobby")

export function doSomethingAsync(param: string): Promise<PushResponse> {
	return SomeChannel.pushAsync("do_something", {param})
}
