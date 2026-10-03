import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { IProduct, IProductCreate, IProductQueryParams, IProductResponse, IProductUpdate } from './products.types';

/**
 * Buscar todos os produtos
 */
export async function getAllProducts(
	this: IExecuteFunctions,
	queryParams: IProductQueryParams = {},
): Promise<IProductResponse> {
	const endpoint = '/products';
	return await request(this, 'GET', endpoint, undefined, queryParams);
}

/**
 * Criar um novo produto
 */
export async function createProduct(this: IExecuteFunctions, productData: IProductCreate): Promise<IProduct> {
	const endpoint = '/products';
	return await request(this, 'POST', endpoint, productData);
}

/**
 * Buscar produto por ID
 */
export async function getProductById(this: IExecuteFunctions, productId: string): Promise<IProduct> {
	const endpoint = `/products/${productId}`;
	return await request(this, 'GET', endpoint);
}

/**
 * Atualizar produto
 */
export async function updateProduct(
	this: IExecuteFunctions,
	productId: string,
	productData: IProductUpdate,
): Promise<IProduct> {
	const endpoint = `/products/${productId}`;
	return await request(this, 'PUT', endpoint, productData);
}

/**
 * Excluir produto
 */
export async function deleteProduct(this: IExecuteFunctions, productId: string): Promise<void> {
	const endpoint = `/products/${productId}`;
	return await request(this, 'DELETE', endpoint);
}

function isFilled(value: unknown): boolean {
	return value !== undefined && value !== null && value !== '';
}

/**
 * Função auxiliar para construir dados do produto
 */
export function buildProductData(data: any): IProductCreate | IProductUpdate {
	const productData: any = {};

	['id_sku', 'name', 'price'].forEach((field) => {
		if (isFilled(data[field])) {
			productData[field] = data[field];
		}
	});

	return productData;
}

/**
 * Função auxiliar para construir os parâmetros de busca de produtos
 */
export function buildProductQueryParams(options: any): IProductQueryParams {
	const queryParams: IProductQueryParams = {};

	if (isFilled(options.skip)) {
		queryParams.skip = options.skip;
	}

	if (isFilled(options.take)) {
		queryParams.take = options.take;
	}

	if (isFilled(options.search)) {
		queryParams.search = options.search;
	}

	return queryParams;
}
