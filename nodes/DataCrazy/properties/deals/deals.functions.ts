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

// Função auxiliar para formatar data para ISO 8601
function formatDateToISO(dateValue: string): string {
	// Se já está no formato ISO 8601 completo, retorna como está
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
		return dateValue;
	}
	
	// Se está no formato ISO 8601 mas sem milissegundos, adiciona
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
		return dateValue.replace('Z', '.000Z');
	}
	
	// Se está no formato ISO 8601 mas sem timezone, adiciona
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
		return dateValue + '.000Z';
	}
	
	// Se está no formato YYYY-MM-DD HH:mm:ss, converte para ISO 8601
	if (dateValue.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
		return dateValue.replace(' ', 'T') + '.000Z';
	}
	
	// Se está no formato YYYY-MM-DD, adiciona horário
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
		return dateValue + 'T00:00:00.000Z';
	}
	
	// Tenta criar uma data válida e converter para ISO
	try {
		const date = new Date(dateValue);
		if (!isNaN(date.getTime())) {
			return date.toISOString();
		}
	} catch (error) {
		// Se não conseguir converter, retorna o valor original
	}
	
	return dateValue;
}

/**
 * Busca negócios por estágio específico
 */
export async function getDealsByStage(
	this: IExecuteFunctions,
	stageId: string,
	take: number = 100,
	skip: number = 0,
	queryParams?: IDealQueryParams,
): Promise<IDealsResponse> {
	const endpoint = '/businesses';
	
	// Criar parâmetros de consulta com filtro de stage
	const baseParams = buildDealQueryParams(queryParams);
	
	// Adicionar parâmetros de paginação
	baseParams.take = take;
	baseParams.skip = skip;
	
	// Adicionar filtro de stage.id
	if (!baseParams.filter) {
		baseParams.filter = {};
	}
	baseParams.filter['stage.id'] = stageId;

	return await request(this, 'GET', endpoint, {}, baseParams);
}

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
			// Filtro de tags - usar diretamente as tags selecionadas
			if (filterItem.tags && Array.isArray(filterItem.tags) && filterItem.tags.length > 0) {
				qs.filter.tags = filterItem.tags.join(',');
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
				// Converter para formato ISO 8601 se necessário
				const dateValue = filterItem.createdAtGreaterOrEqual.trim();
				qs.filter.createdAtGreaterOrEqual = formatDateToISO(dateValue);
			}

			if (filterItem.createdAtLessOrEqual !== undefined && filterItem.createdAtLessOrEqual.trim() !== '') {
				// Converter para formato ISO 8601 se necessário
				const dateValue = filterItem.createdAtLessOrEqual.trim();
				qs.filter.createdAtLessOrEqual = formatDateToISO(dateValue);
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
			// Converter para formato ISO 8601 se necessário
			const dateValue = filter.createdAtGreaterOrEqual.trim();
			qs.filter.createdAtGreaterOrEqual = formatDateToISO(dateValue);
		}

		if (filter.createdAtLessOrEqual !== undefined && filter.createdAtLessOrEqual.trim() !== '') {
			// Converter para formato ISO 8601 se necessário
			const dateValue = filter.createdAtLessOrEqual.trim();
			qs.filter.createdAtLessOrEqual = formatDateToISO(dateValue);
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