import {get, type Writable, writable} from "svelte/store"
import {Toastr} from "@keenmate/svelte-adminlte"
import {Channel as PhoenixChannel, Socket} from "phoenix"
import throttle from "lodash/throttle"
import {SocketUrl} from "$lib/constants/urls"
import {ErrorToastrTimeout, WarningToastrTimeout} from "$lib/constants/toastr"
import {
  Channel,
  pushSocketMessageAsync
} from "@keenmate/js-common-helpers/socket/channel.js"
import {getChannelTimeout, pushChannelTimeout} from "$lib/constants/socket"
import type {PushResponse} from "$lib/types/channel-types"

const socket: Writable<Socket | null> = writable(null)

export const SocketConnected = writable(false)
export const SocketReconnectRetriesFailed = writable(false)

export function initSocket(token: string) {
  const existing = get(socket)
  if (existing) {
    existing.disconnect()
  }
  const socketInstance = new Socket(SocketUrl(), {
    reconnectAfterMs(tries) {
      const durations = [100, 1000, 10000]

      if (tries > durations.length) {
        SocketReconnectRetriesFailed.set(true)

        return Infinity
      } else return durations[(tries - 1) % durations.length] || 5000
    },
    params: {
      token
    }
  })

  socketInstance.onClose(() => {
    socketToastDisconnectedThrottled("warning", "Connection closed", null, {
      timeOut: WarningToastrTimeout
    })
    SocketConnected.set(false)

    if (get(SocketReconnectRetriesFailed)) {
      socketInstance.disconnect()
    }
  })
  socketInstance.onOpen(() => {
    Toastr.success("Connection established")
    SocketConnected.set(true)
    SocketReconnectRetriesFailed.set(false)
    socket.set(socketInstance)
  })
  socketInstance.onError(error => {
    if (!get(SocketConnected)) return

    console.error("Error occured in socket connection", error)
    if (error === "expired") {
      Toastr.warning("Session expired", null, {timeOut: WarningToastrTimeout})
      // redirectToLogin()
    } else
      socketToastThrottled(
        "error",
        "Error occured while communicating with server",
        null,
        {timeOut: ErrorToastrTimeout}
      )
  })

  socketInstance.connect()

  return socketInstance
}

const socketToastDisconnectedThrottled = throttle(function (type, ...rest) {
  Toastr[type].apply(Toastr, rest)
}, 60000)

const socketToastThrottled = throttle(function (type, ...rest) {
  Toastr[type].apply(Toastr, rest)
}, 10000)

export default socket

/**
 * @param channel
 * @param event
 * @param payload
 * @param pushTimeout - timeout for push, if it is <= 0 then it is ignored
 * @param channelTimeout
 */
export async function savePushRawAsync<TResponse>(
  channel: Channel,
  event: string,
  payload: any,
  pushTimeout: number = pushChannelTimeout,
  channelTimeout: number = getChannelTimeout
): Promise<TResponse> {
  try {
    const startTime = Date.now()
    const c = await getChannelTimeoutAsync(channel, channelTimeout)

    const response = await pushTimeoutAsync<TResponse>(
      c,
      event,
      payload,
      pushTimeout
    )

    const endTime = Date.now()

    console.debug(
      `push ${c.topic}.${event} (${endTime - startTime}ms)`,
      payload,
      response
    )

    return response
  } catch (e) {
    if (e === "channel-timeout") {
      console.error(
        `timeout while waiting for channel ${channel.topic} before sending ${event}, make sure you are connectiong to that channel`
      )
      throw e
    }

    if (e === "push-timeout") {
      console.error(`timeout while waiting for push ${channel.topic}.${event}`)
      throw e
    }

    console.error(`error while pushing ${channel.topic}.${event}`, e)
    throw e
  }
}

/**
 * @param channel
 * @param event
 * @param payload
 * @param pushTimeout - timeout for push, if it is <= 0 then it is ignored
 * @param channelTimeout
 */
export async function savePushAsync<TData>(
  channel: Channel,
  event: string,
  payload: any,
  pushTimeout: number = pushChannelTimeout,
  channelTimeout: number = getChannelTimeout
): Promise<TData> {
  const {data} = await savePushRawAsync<PushResponse<TData>>(
    channel,
    event,
    payload,
    pushTimeout,
    channelTimeout
  )

  return data
}

async function getChannelTimeoutAsync(
  channel: Channel,
  timeout: number
): Promise<PhoenixChannel> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("channel-timeout"), timeout)
    channel.getAsync().then(resolve).catch(reject)
  })
}

async function pushTimeoutAsync<TData>(
  channel: PhoenixChannel,
  event: string,
  payload: any,
  timeout: number
): Promise<TData> {
  return new Promise((resolve, reject) => {
    if (timeout > 0) {
      setTimeout(() => reject("push-timeout"), timeout)
    }
    pushSocketMessageAsync<TData>(channel, event, payload)
      .then(resolve)
      .catch(reject)
  })
}
