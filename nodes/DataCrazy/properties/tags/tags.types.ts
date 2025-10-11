/**
 * Interfaces e tipos para o módulo de Tags do DataCrazy
 */

export interface ITag {
	id: string;
	name: string;
	color: string;
	description?: string;
	useRandomColor?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface ITagCreate {
	name: string;
	color: string;
	description?: string;
	useRandomColor?: boolean;
}

export interface ITagUpdate {
	name?: string;
	color?: string;
	description?: string;
	useRandomColor?: boolean;
}

export interface ITagResponse {
	data: ITag[];
	total: number;
	page: number;
	limit: number;
}