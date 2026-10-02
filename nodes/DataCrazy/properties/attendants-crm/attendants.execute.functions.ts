import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { IAttendant, IAttendantsMultiQueryParams, IAttendantsResponse } from './attendants.types';

/**
 * Buscar todos os atendentes do CRM
 */
export async function getAllCrmAttendants(this: IExecuteFunctions): Promise<IAttendantsResponse> {
	const endpoint = '/attendants/crm';
	return await request(this, 'GET', endpoint);
}

/**
 * Buscar atendente do CRM por ID
 */
export async function getCrmAttendantById(this: IExecuteFunctions, attendantId: string): Promise<IAttendant> {
	const endpoint = `/attendants/crm/${attendantId}`;
	return await request(this, 'GET', endpoint);
}

/**
 * Buscar todos os atendentes do Multi
 */
export async function getAllMultiAttendants(
	this: IExecuteFunctions,
	queryParams?: IAttendantsMultiQueryParams,
): Promise<IAttendantsResponse> {
	const endpoint = '/attendants/multi';
	return await request(this, 'GET', endpoint, undefined, queryParams);
}

/**
 * Buscar atendente do Multi por ID
 */
export async function getMultiAttendantById(this: IExecuteFunctions, attendantId: string): Promise<IAttendant> {
	const endpoint = `/attendants/multi/${attendantId}`;
	return await request(this, 'GET', endpoint);
}

/**
 * Função auxiliar para construir parâmetros de busca do Multi
 */
export function buildMultiAttendantsQueryParams(data: any): IAttendantsMultiQueryParams {
	const queryParams: IAttendantsMultiQueryParams = {};

	if (data.search !== undefined && data.search !== '') {
		queryParams.search = data.search;
	}

	return queryParams;
}
