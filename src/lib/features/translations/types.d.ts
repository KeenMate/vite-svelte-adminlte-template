export type TranslationsQuery = {
	searchText: string | null;
	languageCode?: string;
	dataGroup: string | null;
	dataObjectCode: string | null;
	dataObjectId: number | null;
};

export type Translation = {
	translationId?: number;
	tenantId: number,
	tenantTitle: string,
	languageCode: string;
	languageValue?: string;
	dataGroup: string;
	dataObjectGroup?: string;
	dataObjectId: number | null;
	dataObjectCode?: string;
	value: string;
};

export type LanguageItem = {
	code: string;
	value: string;
}

export type LanguageType = {
	isFrontendLanguage?: boolean;
	isBackendLanguage?: boolean;
	isCommunicationLanguage?: boolean;
	frontendLogicalOrder?: 0;
	backendLogicalOrder?: 0;
	communicationLogicalOrder?: 0;
	isDefaultBackendLanguage?: boolean;
	isDefaultFrontendLanguage?: boolean;
	isDefaultCommunicationLanguage?: boolean;
} & LanguageItem;

export type CopyTranslations = {
	sourceLanguage: string;
	targetLanguage: string;
	dataGroup: string;
	overwrite: boolean;
};

export type AnyStringObj = { [key: string]: string };
