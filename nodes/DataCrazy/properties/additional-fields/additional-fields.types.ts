export interface IAdditionalField {
	id: string;
	name: string;
	type: string;
	entity: 'lead' | 'business';
	required: boolean;
	options?: string[];
}

export interface IAdditionalFieldValue {
	value: string | number | boolean;
}

export interface IAdditionalFieldQueryParams {
	skip?: number;
	take?: number;
	filter?: {
		entity?: 'lead' | 'business';
	};
}

export type AdditionalFieldScope = 'lead' | 'deal';