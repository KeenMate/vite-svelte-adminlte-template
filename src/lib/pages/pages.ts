import {SvelteComponent} from "svelte"
import type {WrappedComponent} from "svelte-spa-router"
import {translate} from "$lib/pages"

export type TranslationText = (i18n: (code: string) => string) => string
export type PageUrlsDict = any // TODO fix this type

export type RouterPages = {
  [key: string]: WrappedComponent | typeof SvelteComponent
}

// spa router doesnt have best types
export type AsyncComponentImport = Promise<{default: typeof SvelteComponent}>

export type Page = {
  name: string
  title: TranslationText
  url: string
  breadcrumb: TranslationText[]
  icon?: string
  hide?: boolean
  nesting?: boolean
  subroutes?: Page[]
  type?: string
  requirements?: {
    any?: string[]
  }
  anyNestedRequirements?: boolean
  component?: () => AsyncComponentImport
}

export const Pages: Page[] = [
  {
    name: "error",
    title: translate("routes.error.title"),
    url: "/error",
    breadcrumb: [translate("routes.error.title")],
    hide: true,
    component: () => import("./Error.svelte") as AsyncComponentImport
  },
  {
    name: "home",
    title: translate("routes.home.title"),
    url: "/",
    breadcrumb: [translate("routes.home.title")],
    icon: "fas fa-home",
    hide: false,
    component: () =>
      import("../features/home/Page.svelte") as AsyncComponentImport
  },
  {
    name: "page1",
    title: translate("routes.page1.title"),
    url: "/page1",
    breadcrumb: [translate("routes.page1.title")],
    icon: "fas fa-file",
    hide: false,
    component: () =>
      import("../features/example/Page.svelte") as AsyncComponentImport
  }
]
