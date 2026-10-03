/**
 * Interfaces e tipos para o módulo de Listas do DataCrazy
 */

export interface IList {
	id: string;
	name: string;
	description?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface IListCreate {
	name: string;
	description?: string;
}

export interface IListUpdate {
	name?: string;
	description?: string;
}

export interface IListQueryParams {
	skip?: number;
	take?: number;
	search?: string;
}

export interface IListResponse {
	count: number;
	data: IList[];
}
