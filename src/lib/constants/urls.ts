import {joinPaths} from "../helpers/string-helpers.js"

export const ServerUrl: string = import.meta.env.VITE_SERVER_URL
export const BaseUrl: string   = import.meta.env.BASE_URL

export const BaseApiUrl: string = joinPaths(ServerUrl, "api")

export const SocketUrl: string = import.meta.env.VITE_SOCKET_URL

// CONTEXT
export const UserContextUrl: string = joinPaths(BaseApiUrl, "context")
export const AccessTokenUrl: string = joinPaths(BaseApiUrl, "auth/access")

// AUTH
export const AuthUrl: string   = joinPaths(ServerUrl, "auth")
export const LoginUrl: string  = joinPaths(AuthUrl, "aad", "new")
export const LogoutUrl: string = joinPaths(AuthUrl, "aad", "delete")

export const LanguageApiUrl = joinPaths(BaseApiUrl, "language")

//TODO this is yet not implemented in the template backend
export const ReauthUrl = joinPaths(ServerUrl, "/admin/reauth-silent")

// LOCALES

export const TranslationsApiBaseUrl: string = joinPaths(BaseApiUrl, "translations")

export const GetGroupTranslationsUrl = (languageCode: string, groupCode: string) =>
	joinPaths(TranslationsApiBaseUrl, languageCode, groupCode)

export const MeApiUrl: string            = joinPaths(BaseApiUrl, "me")
// export const UserProfileUrl: string = MeApiUrl
export const SetCurrentLocaleUrl: string = joinPaths(MeApiUrl, "current-locale")

// SYSTEM
export const SystemBaseUrl: string        = joinPaths(BaseApiUrl, "system")
export const SystemEnvironmentUrl: string = joinPaths(SystemBaseUrl, "environment")
export const VersionsUrl: string          = joinPaths(SystemBaseUrl, "versions")

// OTHER

export const ContentFileEndpoints = {
	downloadFile: fileCode => `/TODO/downloadFile/${fileCode}`
}
