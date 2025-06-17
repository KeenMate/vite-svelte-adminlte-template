export type LanguageItem2 = {
	name: string
	title: string
}

export type SimpleLanguageItem = {
	code: string
	value: string
}

export type LanguageDetailType = {
	value: string,
	code: string,
	isBackendLanguage: boolean,
	isFrontendLanguage: boolean,
	isCommunicationLanguage: boolean,
	isDefaultBackendLanguage: boolean,
	isDefaultFrontendLanguage: boolean,
	isDefaultCommunicationLanguage: boolean,
	backendLogicalOrder: number,
	frontendLogicalOrder: number,
	communicationLogicalOrder: number
}
