export const AppUrl = "http://localhost:4000"
export const SocketUrl = () => AppUrl.replace("http", "ws") + "/socket"

export const LogoutUrl = AppUrl + "/auth/delete"
export const LoginUrl = AppUrl + "/auth/aad/new"
export const UserContextUrl = AppUrl + "/api/context"
export const LanguageApiUrl = AppUrl + "/api/language"

//TODO this is yet not implemented in the template backend
export const ReauthUrl = AppUrl + "/admin/reauth-silent"

export const ContentFileEndpoints = {
  downloadFile: fileCode => `/TODO/downloadFile/${fileCode}`
}
