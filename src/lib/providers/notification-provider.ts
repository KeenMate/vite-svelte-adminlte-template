import CBuffer from "CBuffer"
import {type Writable, writable} from "svelte/store"
import {DateTime} from "luxon"

import {Toastr} from "@keenmate/svelte-adminlte"

const MessageCount = 500

export const Warning = "Warning"
export const Success = "Success"
export const Error = "Error"

export type message = {
  type: string
  message: string
  title: string | undefined
  timestamp: DateTime
  notificationId: number
}

export type toastrOptions = any

class NotificationProvider {
  buffer: CBuffer<message>
  messages: Writable<message[]>

  constructor() {
    this.buffer = new CBuffer<message>(MessageCount)
    this.messages = writable([])
  }

  warning(
    message: string,
    title: string | undefined = undefined,
    options: toastrOptions = {}
  ) {
    this.#saveMessage(Warning, message, title)
    Toastr.warning(message, title, options)
  }

  success(
    message: string,
    title: string | undefined = undefined,
    options: toastrOptions = {}
  ) {
    this.#saveMessage(Success, message, title)
    Toastr.success(message, title, options)
  }

  error(
    message: string,
    title: string | undefined = undefined,
    options: toastrOptions = {}
  ) {
    this.#saveMessage(Error, message, title)
    Toastr.error(message, title, options)
  }

  #saveMessage(type: string, message: string, title: string | undefined) {
    this.buffer.push({
      type,
      message,
      title,
      timestamp: DateTime.now(),
      notificationId: Math.random()
    })
    this.messages.set(this.buffer.toArray())
  }
}

export default new NotificationProvider()
