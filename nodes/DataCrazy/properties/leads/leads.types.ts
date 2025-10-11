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

export interface ILeadQueryParams {
	limit?: number;
	page?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	source?: string;
	email?: string;
}