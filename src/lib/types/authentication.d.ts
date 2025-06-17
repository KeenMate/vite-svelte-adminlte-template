import type {SimpleLanguageItem} from "$lib/types/languages.js"

export type SessionUser = {
	userId: number
	oid?: string | null
	username: string,
	displayName: string,
	groups: string[]
	roles: UserRole[]
	permissions: string[]
	accountActivated: boolean
	accountEnabled: boolean
	lastSeenNotificationId?: number | null
	phone: string | null
}

export type UserContextType = {
	currentLocale: string | null
	user: SessionUser | null
	languages: SimpleLanguageItem[] | null
	/**
	 * Date&Time at which the session should expire (in seconds)
	 */
	sessionTimeout: number | null
	socketToken: string | null
}

export type UserRole = {
	userGroupCode: string,
	userGroupId: number,
	userGroupTitle: string
}
