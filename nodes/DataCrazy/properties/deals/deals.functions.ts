/**
 * Funções de API para operações de negócios (deals) no DataCrazy
 */

import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import {
	IDeal,
	IDealQueryParams,
	ICreateDealData,
	IUpdateDealData,
	IDealsResponse,
	IDealResponse,
} from './deals.types';

/**
 * Busca todos os negócios
 */
export async function getAllDeals(
	this: IExecuteFunctions,
	queryParams?: IDealQueryParams,
): Promise<IDealsResponse> {
	const endpoint = '/businesses';
	const qs = buildDealQueryParams(queryParams);

	return await request(this, 'GET', endpoint, {}, qs);
}

/**
 * Cria um novo negócio
 */
export async function createDeal(
	this: IExecuteFunctions,
	dealData: ICreateDealData,
): Promise<IDealResponse> {
	const endpoint = '/businesses';
	const body = buildDealData(dealData);

	return await request(this, 'POST', endpoint, body);
}

/**
 * Busca um negócio por ID
 */
export async function getDealById(
	this: IExecuteFunctions,
	dealId: string,
): Promise<IDealResponse> {
	const endpoint = `/businesses/${dealId}`;

	return await request(this, 'GET', endpoint, {});
}

/**
 * Atualiza um negócio existente
 */
export async function updateDeal(
	this: IExecuteFunctions,
	dealId: string,
	dealData: IUpdateDealData,
): Promise<IDealResponse> {
	const endpoint = `/businesses/${dealId}`;
	const body = buildDealData(dealData);

	return await request(this, 'PATCH', endpoint, body);
}

/**
 * Exclui um negócio
 */
export async function deleteDeal(
	this: IExecuteFunctions,
	dealId: string,
): Promise<void> {
	const endpoint = `/businesses/${dealId}`;

	return await request(this, 'DELETE', endpoint, {});
}

/**
 * Constrói os dados do negócio para envio à API
 */
export function buildDealData(dealData: ICreateDealData | IUpdateDealData): any {
	const data: any = {};

	if (dealData.leadId !== undefined) {
		data.leadId = dealData.leadId;
	}

	if (dealData.stageId !== undefined) {
		data.stageId = dealData.stageId;
	}

	if (dealData.attendantId !== undefined) {
		data.attendantId = dealData.attendantId;
	}

	if (dealData.externalId !== undefined) {
		data.externalId = dealData.externalId;
	}

	return data;
}

/**
 * Constrói os parâmetros de consulta para busca de negócios
 */
export function buildDealQueryParams(queryParams?: IDealQueryParams): any {
	if (!queryParams) {
		return {};
	}

	const qs: any = {};

	if (queryParams.page !== undefined) {
		qs.page = queryParams.page;
	}

	if (queryParams.limit !== undefined) {
		qs.limit = queryParams.limit;
	}

	if (queryParams.leadId !== undefined) {
		qs.leadId = queryParams.leadId;
	}

	if (queryParams.stageId !== undefined) {
		qs.stageId = queryParams.stageId;
	}

	if (queryParams.attendantId !== undefined) {
		qs.attendantId = queryParams.attendantId;
	}

	if (queryParams.externalId !== undefined) {
		qs.externalId = queryParams.externalId;
	}

	if (queryParams.createdAt !== undefined) {
		qs.createdAt = queryParams.createdAt;
	}

	if (queryParams.updatedAt !== undefined) {
		qs.updatedAt = queryParams.updatedAt;
	}

	return qs;
}