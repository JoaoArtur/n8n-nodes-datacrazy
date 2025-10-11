import type { IExecuteFunctions } from 'n8n-workflow';
import type { IPipelineQueryParams, IPipelineListResponse, IStage } from './pipelines.types';
import { request } from '../../GenericFunctions';

/**
 * Lista todos os pipelines disponíveis
 */
export async function getAllPipelines(
	this: IExecuteFunctions,
	queryParams?: IPipelineQueryParams,
): Promise<IPipelineListResponse> {
	try {
		const response = await request(
			this,
			'GET',
			'/pipelines',
			undefined,
			queryParams,
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
): Promise<IStage[]> {
	try {
		const response = await request(
			this,
			'GET',
			`/pipelines/${pipelineId}/stages`,
			undefined,
			undefined,
			'https://crm.g1.datacrazy.io/api/crm',
		);
		return response as IStage[];
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

	if (take !== undefined) params.take = take;
	if (skip !== undefined) params.skip = skip;
	if (search) params.search = search;

	return params;
}
