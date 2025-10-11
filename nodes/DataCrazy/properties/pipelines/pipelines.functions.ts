import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import type {
	IPipelineQueryParams,
	IPipelineListResponse,
	IStage,
	IStagesResponse,
} from './pipelines.types';
import { request, requestForLoadOptions } from '../../GenericFunctions';

/**
 * Lista todos os pipelines disponíveis
 */
export async function getAllPipelines(
	this: IExecuteFunctions,
	queryParams?: IPipelineQueryParams,
): Promise<IPipelineListResponse> {
	try {
		// Garantir que sempre inclua filter[all]='true'
		const finalQueryParams = {
			...queryParams,
			filter: { all: 'true', ...(queryParams?.filter || {}) }
		};

		const response = await request(
			this,
			'GET',
			'/pipelines',
			undefined,
			finalQueryParams,
			'https://crm.g1.datacrazy.io/api/crm',
		);
		return response as IPipelineListResponse;
	} catch (error: any) {
		throw new Error(`Erro ao buscar pipelines: ${error.message}`);
	}
}

/**
 * Lista os estágios de um pipeline específico
 */
export async function getPipelineStages(
	this: IExecuteFunctions,
	pipelineId: string,
): Promise<IStagesResponse[]> {
	try {
		const response = await request(
			this,
			'GET',
			`/pipelines/${pipelineId}/stages`,
			undefined,
			undefined,
			'https://crm.g1.datacrazy.io/api/crm',
		);
		return response as IStagesResponse[];
	} catch (error: any) {
		throw new Error(`Erro ao buscar estágios do pipeline: ${error.message}`);
	}
}

/**
 * Busca os estágios de um pipeline específico para uso em loadOptions
 */
export async function getPipelineStagesForLoadOptions(
	this: ILoadOptionsFunctions,
	pipelineId: string,
): Promise<IStagesResponse> {
	try {
		const response = await requestForLoadOptions(
			this,
			'GET',
			`/pipelines/${pipelineId}/stages`,
			undefined,
			undefined,
			'https://crm.g1.datacrazy.io/api/crm',
		);
		return response as IStagesResponse;
	} catch (error: any) {
		throw new Error(`Erro ao buscar estágios do pipeline: ${error.message}`);
	}
}
/**
 * Constrói os parâmetros de query para busca de pipelines
 */
export function buildPipelineQueryParams(
	take?: number,
	skip?: number,
	search?: string,
): IPipelineQueryParams {
	const params: IPipelineQueryParams = {};

	// Sempre incluir filter[all]='true' para buscar todos os pipelines
	params.filter = { all: 'true' };

	if (take !== undefined) params.take = take;
	if (skip !== undefined) params.skip = skip;
	if (search) params.search = search;

	return params;
}
