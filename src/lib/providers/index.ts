import {Json} from "@keenmate/js-common-helpers/constants/content-types"
import {ContentType} from "@keenmate/js-common-helpers/constants/headers"

export async function configuredFetch(
  resource: string,
  requestInfo: RequestInit = null
) {
  const headers = getHeaders(requestInfo)

  const response = await fetch(resource, {
    headers,
    ...(requestInfo || {})
  })

  if (response.status >= 400) throw response

  return response
}

function getHeaders(request) {
  const headers = {}

  if (!request) return headers

  if (typeof request.body === "string") headers[ContentType] = Json
  // if (request.body instanceof FormData)
  // 	headers["Content-Type"] = "..."

  return headers
}
