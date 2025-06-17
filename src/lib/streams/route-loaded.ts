import {Subject} from "rxjs"
import type {RouteDetail} from "@keenmate/svelte-spa-router"

export const RouteLoadedSubject = new Subject<RouteDetail>()
