import {UserContextUrl} from "../constants/urls.ts"
import {configuredFetch} from "./index.js"

export async function getUserContextAsync() {
  const options: RequestInit = {
    credentials: "include"
  }

  const response = await configuredFetch(UserContextUrl, options)

  const parsedResponse = await response.json()

  console.log("user context", parsedResponse.data)
  return await parsedResponse.data
}
