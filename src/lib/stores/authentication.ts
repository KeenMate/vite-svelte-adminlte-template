import {
  getCurrentLocale,
  getCurrentUser,
  getLanguages,
  getSessionTimeout,
  getSocketToken
} from "$lib/constants/index.js"
import {derived, writable} from "svelte/store"
import type {Nullable} from "@keenmate/js-common-helpers/types/helpers.js"

import {Config} from "@keenmate/svelte-adminlte"

// Stores
export let userContext = writable({
  currentLocale: getCurrentLocale(),
  currentUser: getCurrentUser(),
  languages: getLanguages(),
  sessionTimeout: getSessionTimeout(),
  socketToken: getSocketToken()
})

export type SessionUser = {
  groups: string[]
  uuid?: Nullable<string>
  displayName: string
}

export const CurrentUser = {
  subscribe(subscription: (value: SessionUser) => void) {
    return Config.subscribe(config => {
      // TODO fix currentUser type
      //@ts-ignore
      subscription(config.currentUser)
    })
  },
  update(value: SessionUser) {
    return Config.update(config => {
      // TODO fix currentUser type
      //@ts-ignore
      config.currentUser = {...config.currentUser, ...value}
      return config
    })
  },
  set(value: SessionUser) {
    return Config.update(config => {
      // TODO fix currentUser type
      //@ts-ignore
      config.currentUser = value
      return config
    })
  }
}
export const isAuthenticated = derived(
  CurrentUser,
  currentUser => !!currentUser?.uuid,
  false
)

export const lastSeenNotificationId = writable(null)
