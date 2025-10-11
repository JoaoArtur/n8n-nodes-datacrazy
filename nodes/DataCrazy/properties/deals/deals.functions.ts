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

	if (dealData.pipelineId !== undefined) {
		data.pipelineId = dealData.pipelineId;
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

	// Parâmetros básicos
	if (queryParams.skip !== undefined) {
		qs.skip = queryParams.skip;
	}

	if (queryParams.take !== undefined) {
		qs.take = queryParams.take;
	}

	if (queryParams.search !== undefined && queryParams.search.trim() !== '') {
		qs.search = queryParams.search.trim();
	}

	// Filtros avançados - usar formato de objeto aninhado para gerar filter[campo]
	if (queryParams.filters && Array.isArray(queryParams.filters) && queryParams.filters.length > 0) {
		if (!qs.filter) {
			qs.filter = {};
		}

		// Processar cada filtro individualmente
		queryParams.filters.forEach((filterItem: any) => {
			// Processar filtro de tags no novo formato
			if (filterItem.tags && filterItem.tags.tagFilter) {
				const tagFilter = filterItem.tags.tagFilter;
				if (tagFilter.operation && tagFilter.tagIds && tagFilter.tagIds.length > 0) {
					const operation = tagFilter.operation;
					const tagIds = tagFilter.tagIds.join(',');
					qs.filter.tags = `${operation} ${tagIds}`;
				}
			}

			if (filterItem.lossReason !== undefined && filterItem.lossReason.trim() !== '') {
				qs.filter.lossReason = filterItem.lossReason.trim();
			}

			if (filterItem.products !== undefined && filterItem.products.trim() !== '') {
				qs.filter.products = filterItem.products.trim();
			}

			if (filterItem.attendants !== undefined && filterItem.attendants.length > 0) {
				qs.filter.attendants = filterItem.attendants.join(',');
			}

			if (filterItem.fields !== undefined && filterItem.fields.trim() !== '') {
				qs.filter.fields = filterItem.fields.trim();
			}

			if (filterItem.status !== undefined && filterItem.status.trim() !== '') {
				qs.filter.status = filterItem.status.trim();
			}

			if (filterItem.businessFields !== undefined && filterItem.businessFields.trim() !== '') {
				qs.filter.businessFields = filterItem.businessFields.trim();
			}

			if (filterItem.source !== undefined && filterItem.source.trim() !== '') {
				qs.filter.source = filterItem.source.trim();
			}

			if (filterItem.minValue !== undefined) {
				qs.filter.minValue = filterItem.minValue;
			}

			if (filterItem.maxValue !== undefined) {
				qs.filter.maxValue = filterItem.maxValue;
			}

			if (filterItem.startDate !== undefined && filterItem.startDate.trim() !== '') {
				qs.filter.startDate = filterItem.startDate.trim();
			}

			if (filterItem.endDate !== undefined && filterItem.endDate.trim() !== '') {
				qs.filter.endDate = filterItem.endDate.trim();
			}

			if (filterItem.createdAtGreaterOrEqual !== undefined && filterItem.createdAtGreaterOrEqual.trim() !== '') {
				qs.filter.createdAtGreaterOrEqual = filterItem.createdAtGreaterOrEqual.trim();
			}

			if (filterItem.createdAtLessOrEqual !== undefined && filterItem.createdAtLessOrEqual.trim() !== '') {
				qs.filter.createdAtLessOrEqual = filterItem.createdAtLessOrEqual.trim();
			}

			if (filterItem.lastMovedAfter !== undefined && filterItem.lastMovedAfter.trim() !== '') {
				qs.filter.lastMovedAfter = filterItem.lastMovedAfter.trim();
			}

			if (filterItem.lastMovedBefore !== undefined && filterItem.lastMovedBefore.trim() !== '') {
				qs.filter.lastMovedBefore = filterItem.lastMovedBefore.trim();
			}
		});
	}

	// Filtros antigos (manter compatibilidade)
	if (queryParams.filter) {
		const filter = queryParams.filter;

		if (!qs.filter) {
			qs.filter = {};
		}

		if (filter.lossReason !== undefined && filter.lossReason.trim() !== '') {
			qs.filter.lossReason = filter.lossReason.trim();
		}

		if (filter.tags !== undefined && filter.tags.trim() !== '') {
			qs.filter.tags = filter.tags.trim();
		}

		if (filter.products !== undefined && filter.products.trim() !== '') {
			qs.filter.products = filter.products.trim();
		}

		if (filter.attendants !== undefined && filter.attendants.length > 0) {
			qs.filter.attendants = filter.attendants.join(',');
		}

		if (filter.fields !== undefined && filter.fields.trim() !== '') {
			qs.filter.fields = filter.fields.trim();
		}

		if (filter.status !== undefined && filter.status.trim() !== '') {
			qs.filter.status = filter.status.trim();
		}

		if (filter.businessFields !== undefined && filter.businessFields.trim() !== '') {
			qs.filter.businessFields = filter.businessFields.trim();
		}

		if (filter.source !== undefined && filter.source.trim() !== '') {
			qs.filter.source = filter.source.trim();
		}

		if (filter.minValue !== undefined) {
			qs.filter.minValue = filter.minValue;
		}

		if (filter.maxValue !== undefined) {
			qs.filter.maxValue = filter.maxValue;
		}

		if (filter.startDate !== undefined && filter.startDate.trim() !== '') {
			qs.filter.startDate = filter.startDate.trim();
		}

		if (filter.endDate !== undefined && filter.endDate.trim() !== '') {
			qs.filter.endDate = filter.endDate.trim();
		}

		if (filter.createdAtGreaterOrEqual !== undefined && filter.createdAtGreaterOrEqual.trim() !== '') {
			qs.filter.createdAtGreaterOrEqual = filter.createdAtGreaterOrEqual.trim();
		}

		if (filter.createdAtLessOrEqual !== undefined && filter.createdAtLessOrEqual.trim() !== '') {
			qs.filter.createdAtLessOrEqual = filter.createdAtLessOrEqual.trim();
		}

		if (filter.lastMovedAfter !== undefined && filter.lastMovedAfter.trim() !== '') {
			qs.filter.lastMovedAfter = filter.lastMovedAfter.trim();
		}

		if (filter.lastMovedBefore !== undefined && filter.lastMovedBefore.trim() !== '') {
			qs.filter.lastMovedBefore = filter.lastMovedBefore.trim();
		}
	}

	return qs;
}