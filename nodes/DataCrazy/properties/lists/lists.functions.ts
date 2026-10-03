import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { IList, IListCreate, IListQueryParams, IListResponse, IListUpdate } from './lists.types';

/**
 * Buscar todas as listas
 */
export async function getAllLists(
	this: IExecuteFunctions,
	queryParams: IListQueryParams = {},
): Promise<IListResponse> {
	const endpoint = '/lists';
	return await request(this, 'GET', endpoint, undefined, queryParams);
}

/**
 * Criar uma nova lista
 */
export async function createList(this: IExecuteFunctions, listData: IListCreate): Promise<IList> {
	const endpoint = '/lists';
	return await request(this, 'POST', endpoint, listData);
}

/**
 * Buscar lista por ID
 */
export async function getListById(this: IExecuteFunctions, listId: string): Promise<IList> {
	const endpoint = `/lists/${listId}`;
	return await request(this, 'GET', endpoint);
}

/**
 * Atualizar lista
 */
export async function updateList(
	this: IExecuteFunctions,
	listId: string,
	listData: IListUpdate,
): Promise<IList> {
	const endpoint = `/lists/${listId}`;
	return await request(this, 'PUT', endpoint, listData);
}

/**
 * Excluir lista
 */
export async function deleteList(this: IExecuteFunctions, listId: string): Promise<void> {
	const endpoint = `/lists/${listId}`;
	return await request(this, 'DELETE', endpoint);
}

function isFilled(value: unknown): boolean {
	return value !== undefined && value !== null && value !== '';
}

/**
 * Função auxiliar para construir dados da lista
 */
export function buildListData(data: any): IListCreate | IListUpdate {
	const listData: any = {};

	['name', 'description'].forEach((field) => {
		if (isFilled(data[field])) {
			listData[field] = data[field];
		}
	});

	return listData;
}

/**
 * Função auxiliar para construir os parâmetros de busca de listas
 */
export function buildListQueryParams(options: any): IListQueryParams {
	const queryParams: IListQueryParams = {};

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
