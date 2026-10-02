/**
 * Interfaces e tipos para o módulo de Produtos do DataCrazy
 */

export interface IProduct {
	id: string;
	id_sku?: string;
	name: string;
	price: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface IProductCreate {
	id_sku?: string;
	name: string;
	price: number;
}

export interface IProductUpdate {
	id_sku?: string;
	name?: string;
	price?: number;
}

export interface IProductQueryParams {
	skip?: number;
	take?: number;
	search?: string;
}

export interface IProductResponse {
	count: number;
	data: IProduct[];
}
