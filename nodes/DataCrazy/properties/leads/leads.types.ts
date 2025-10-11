// Lead-specific interfaces and types

export interface ILeadAddress {
	zip?: string;
	address?: string;
	block?: string;
	city?: string;
	state?: string;
	country?: string;
}

export interface ILeadSourceReferral {
	sourceId?: string;
	sourceUrl?: string;
	ctwaId?: string;
}

export interface ILeadTag {
	id: string[];
}

export interface ILeadList {
	id: string[];
}

export interface ILeadAttendant {
	id: string;
}

export interface ILead {
	id?: string;
	name: string;
	image?: string;
	phone?: string;
	email?: string;
	source?: string;
	company?: string;
	taxId?: string;
	site?: string;
	instagram?: string;
	address?: ILeadAddress;
	sourceReferral?: ILeadSourceReferral;
	tags?: ILeadTag[];
	lists?: ILeadList[];
	attendant?: ILeadAttendant;
}

// Interfaces para filtros avançados
export interface ILeadCompleteOptions {
	additionalFields?: boolean;
}

export interface ILeadFilterOptions {
	tags?: string;
	stages?: string;
	minLastPurchaseDate?: string;
	maxLastPurchaseDate?: string;
	productsInBusiness?: number;
	minBusinessesCount?: number;
	maxBusinessesCount?: number;
	lists?: string;
	hasMessages?: boolean;
	notHasMessages?: boolean;
	source?: string;
	products?: string;
	attendant?: string;
	fields?: string;
	createdAtGreaterOrEqual?: string;
	createdAtLessOrEqual?: string;
	address?: string;
}

export interface ILeadQueryParams {
	skip?: number;
	take?: number;
	search?: string;
	complete?: ILeadCompleteOptions;
	filter?: ILeadFilterOptions;
	[key: string]: any;
}