
export const maxFileUploadSize = 10000000 // 10M

export const DevelopmentFeaturesEnabled =
	import.meta.env.VITE_DEVELOPMENT_FEATURES_ENABLED === "true"


export function getUserContextFromHtml() {
  const value = document.getElementById("user-context")?.value

  return value
    && JSON.parse(value)
    || getEmptyUserContext()
}

export function getAccessTokenFromHtml() {
	return document.getElementById("access-token")?.value
}

function getEmptyUserContext() {
  return {
    socketToken: null,
    languages: [],
    sessionTimeout: null,
    currentLocale: "en"
  }
}
